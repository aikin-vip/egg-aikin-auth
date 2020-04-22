import { Context } from 'egg';
import { Request, Response, Token, UnauthorizedRequestError } from '../../oauth-server';

export default () => {
  return async (ctx: Context, next: Function) => {
    ctx.user = undefined;
    if (ctx.headers.authorization) {
      const request = ctx.request;
      const response = new Response();
      let token: Token | undefined;
      try {
        token = await ctx.app.oauth.authenticate(new Request({
          headers: request.header,
          query: request.query,
          body: request.body,
          method: request.method,
        }), response);
      } catch (e) {
        // ctx.body = {message: 'Unauthorized', code: 401};
        // ctx.status = 401
        // ctx.set(response.headers);
        throw new UnauthorizedRequestError('Unauthorized');
      }
      if (token && token.user && token.user.uid) {
        ctx.user = { uid: token.user.uid, type: token.user.type, ...token.user };
      }
    }
    return next();
  };
};
