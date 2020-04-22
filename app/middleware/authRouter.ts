import { Context, EggAppConfig } from 'egg';
import { Request, Response } from '../../oauth-server';
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';
import { GROUP, ValidateRule } from '../../validateRule';
import Admin from '../../model/admin';
import User from '../../model/user';

export class ValidateError extends Error {

  message: string;
  code: number;
  status: number;
  errors: any;

  constructor(message?: string, properties: { code?: number; status?: number; errors?: any } = {}) {
    super();
    this.message = message || '参数验证失败';
    Object.keys(properties).forEach(key => (this[key] = properties[key]));
    Error.captureStackTrace(this, ValidateError);
  }
}


export default (options: EggAppConfig['authRouter']) => {
  return async (ctx: Context, next) => {
    const validateRequest = async () => {
      const validateError = await validate(
        plainToClass(ValidateRule, ctx.request.body),
        { groups: [ ctx.request.body.refresh_token ? GROUP.REFRESH_TOKEN : GROUP.ACCESS_TOKEN ] },
      );
      if (validateError.length > 0) {
        const constraints = validateError[0].constraints;
        throw new ValidateError(constraints[Object.keys(constraints)[0]], {
          code: 400,
          errors: validateError,
          status: 400,
        });
      }
    };

    ctx.app.router.post(options.userTokenPath || '/api/v1/token', async ctx => {
      await validateRequest();
      const request = ctx.request;
      const response = new Response();
      await ctx.app.oauth.token(new Request({
        headers: request.header,
        query: request.query,
        body: {
          ...request.body,
          client_id: 1,
          client_secret: 'FW9FD755KI4Z6DQ0',
          grant_type: request.body.refresh_token ? 'refresh_token' : 'password',
        },
        method: request.method,
      }), response, { model: new User() });
      ctx.body = response.body;
      ctx.status = response.status;
      ctx.set(response.headers);
    });

    ctx.app.router.post(options.adminTokenPath || '/api/admin/token', async ctx => {
      await validateRequest();
      const request = ctx.request;
      const response = new Response();
      await ctx.app.oauth.token(new Request({
        headers: request.header,
        query: request.query,
        body: {
          ...request.body,
          client_id: 1,
          client_secret: 'FW9FD755KI4Z6DQ0',
          grant_type: request.body.refresh_token ? 'refresh_token' : 'password',
        },
        method: request.method,
      }), response, { model: new Admin() });
      ctx.body = response.body;
      ctx.status = response.status;
      ctx.set(response.headers);
    });
    return next();
  };
};
