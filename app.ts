import { OAuth2Server } from './oauth-server';
import User from './model/user';
import { Application } from 'egg';

export default class AppBootHook {
  private readonly app: Application;

  constructor(app: Application) {
    this.app = app;
  }

  configWillLoad() {
    this.app.config.coreMiddlewares.push(...[ 'auth', 'authRouter' ]);
  }

  async didLoad() {
    // this.app.coreLogger.info('[egg-aikin-auth] egg-aikin-auth begin start');
    // const start = Date.now();
    const config = this.app.config.auth || {};
    try {
      this.app.oauth = new OAuth2Server({
        ...config,
        model: config.model ? config.model : new User(),
      });
      this.app.logger.info('[egg-aikin-auth] start success');
    } catch (e) {
      this.app.coreLogger.error('[egg-aikin-auth] start fail, %s', e);
      return;
    }
    // this.app.coreLogger.info('[egg-aikin-auth] egg-aikin-auth started use %d ms', Date.now() - start);
  }
}
