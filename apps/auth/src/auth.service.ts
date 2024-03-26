import { UserDocument } from '@app/comman';
import * as crypto from 'crypto';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
import { TokenPayload } from './users/dto/get-user.dto';
import { UsersService } from './users/users.service';
import { Request as ExpressRequest } from 'express';
@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
  ) {}
  getHello(): string {
    return 'Hello Test Auto deploy is it working!';
  }

  async login(user: UserDocument, response: Response) {
    const tokenPayload: TokenPayload = {
      userId: user._id.toHexString(),
    };

    const expires = new Date();
    expires.setSeconds(
      expires.getSeconds() + this.configService.get('JWT_EXPIRATION'),
    );

    const token = this.jwtService.sign(tokenPayload);
    response.cookie('Authentication', token, {
      httpOnly: true,
      expires,
    });

    return token;
  }

  async verifyEmail(token: string, requestObj: ExpressRequest) {
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
    const user = await this.usersService.findOne(
      {
        emailVerificationToken: hashedToken,
      },
      'Invalid Token',
    );
    if (user.emailVerificationExpiry < Date.now()) {
      throw new Error('Token expired');
    }
    user.isEmailVerified = true;
    user.emailVerificationToken = null;
    user.emailVerificationExpiry = null;
    await this.usersService.update(user._id.toHexString(), user);
    const redirectUrl =
      requestObj.protocol + '://' + requestObj.get('host')
        ? requestObj.get('host') + '/auth/login'
        : `localhost:${this.configService.get('PORT')}` + '/auth/login';
    return redirectUrl;
  }
}
