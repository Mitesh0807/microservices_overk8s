import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { UsersService } from '../users.service';

@Injectable()
export class LocalStategy extends PassportStrategy(Strategy) {
  constructor(private readonly usersService: UsersService) {
    super({ usernameField: 'email_or_username' });
  }

  async validate(email: string, password: string) {
    try {
      const user = await this.usersService.verifyUser(email, password);
      return user;
    } catch (err) {
      console.log(err, 'err');
      throw new UnauthorizedException(err);
    }
  }
}
