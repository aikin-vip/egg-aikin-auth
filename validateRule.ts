import { IsNotEmpty, Length } from 'class-validator';

export const GROUP = {
  ACCESS_TOKEN: 'access_token',
  REFRESH_TOKEN: 'refresh_token',
};

export class ValidateRule {

  @IsNotEmpty({
    groups: [ GROUP.ACCESS_TOKEN ],
    message: '用户名不能为空',
  })
  username: string;

  @IsNotEmpty({
    groups: [ GROUP.ACCESS_TOKEN ],
    message: '密码不能为空',
  })
  @Length(4, 30, {
    groups: [ GROUP.ACCESS_TOKEN ],
    message: '密码长度为5到30个字符之间',
  })
  password: string;

  @IsNotEmpty({
    groups: [ GROUP.REFRESH_TOKEN ],
    message: 'refresh_token不能为空',
  })
  refresh_token: string

}
