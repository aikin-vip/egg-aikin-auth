import * as bcrypt from 'bcrypt';
import { Admin as AdminEntity } from '../entity/admin';
import User from './user';

export default class Admin extends User {

  async getUser(username: string, password: string) {
    const where = {};
    where[this.getAccountType(username)] = username;
    const manager = await this.manager.findOne(AdminEntity, {
      where,
      select: [ 'password', 'id' ],
    });
    if (!manager || !(await bcrypt.compare(password, manager.password))) {
      return;
    }
    return { uid: manager.id, type: 1 };
  }
}
