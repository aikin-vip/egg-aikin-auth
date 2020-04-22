import { Client, RefreshToken, Token, User as IUser } from '../oauth-server/lib/interfaces';
import * as bcrypt from 'bcrypt';
import { getManager } from 'typeorm';
import { Token as TokenEntity } from '../entity/token';
import { User as UserEntity } from '../entity/user';

export default class User {

  manager = getManager();

  getAccountType = (account: string): 'mobile' | 'email' | 'username' =>
    (/^1[34578]\d{9}$/.test(account) ? 'mobile' : (/^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/.test(account) ? 'email' : 'username'));

  async getAccessToken(accessToken: string) {
    const tokenEntity = await this.manager.findOne(TokenEntity, { accessToken });
    if (!tokenEntity) {
      return;
    }
    return {
      accessToken: tokenEntity.accessToken,
      accessTokenExpiresAt: new Date(tokenEntity.accessTokenAt),
      refreshToken: tokenEntity.refreshToken,
      refreshTokenExpiresAt: new Date(tokenEntity.refreshTokenAt),
      client: await this.getClient(),
      user: { uid: tokenEntity.uid, type: tokenEntity.type },
    };
  }

  getClient() {
    return { id: 1, grants: [ 'password', 'refresh_token' ] };
  }

  async getRefreshToken(refreshToken: string) {
    const refreshTokenEntity = await this.manager.findOne(TokenEntity, { refreshToken });
    if (!refreshTokenEntity || refreshTokenEntity.refreshToken != refreshToken) {
      return;
    }
    return {
      refreshToken: refreshTokenEntity.refreshToken,
      refreshTokenExpiresAt: new Date(refreshTokenEntity.refreshTokenAt),
      client: await this.getClient(),
      user: { uid: refreshTokenEntity.uid, type: refreshTokenEntity.type },
    };
  }

  async getUser(username: string, password: string) {
    const where = {};
    where[this.getAccountType(username)] = username;
    const user = await this.manager.findOne(UserEntity, {
      where,
      select: [ 'password', 'id' ],
    });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return;
    }
    return { uid: user.id, type: 0 };
  }

  revokeToken(token: RefreshToken | Token) {
    let where: string;
    let parameters: {};
    if (token.accessToken) {
      where = 'access_token = :accessToken';
      parameters = { accessToken: token.accessToken };
    } else {
      where = 'refresh_token = :refresh_token or refresh_token_at < :refresh_token_at';
      parameters = { refresh_token: token.refreshToken, refresh_token_at: new Date() };
    }
    this.manager.createQueryBuilder().from(TokenEntity, 'token').delete()
      .where(where, parameters)
      .execute()
      .catch();
    return true;
  }

  saveToken(token: Token, client: Client, user: IUser) {
    this.manager.insert(TokenEntity, {
      ...token,
      ...{
        uid: user.uid,
        type: user.type,
        accessTokenAt: token.accessTokenExpiresAt,
        refreshTokenAt: token.refreshTokenExpiresAt,
      },
    }).catch();
    return { ...token, ...{ client, user } };
  }
}
