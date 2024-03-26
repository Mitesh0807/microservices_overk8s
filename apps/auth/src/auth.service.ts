import { MAILING_SERVICE, UserDocument } from '@app/comman';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
import { TokenPayload } from './users/dto/get-user.dto';
import { ClientProxy } from '@nestjs/microservices';
@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    @Inject(MAILING_SERVICE) private readonly mailingService: ClientProxy,
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
    this.mailingService.emit('mail_notify',{
      email: user.email,
      subject: 'Verify Email',
      html: `<a href="http://localhost:3000/auth/verify-email?token=${token}">Click here to verify your email</a>`,
    })
    response.cookie('Authentication', token, {
      httpOnly: true,
      expires,
    });

    return token;
  }
}
