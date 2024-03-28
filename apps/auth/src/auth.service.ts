import { MAILING_SERVICE, UserDocument } from '@app/comman';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { ClientProxy } from '@nestjs/microservices';
import * as bcrypt from 'bcryptjs';
import * as crypto from 'crypto';
import { Request as ExpressRequest, Response } from 'express';
import { ChangePasswordDto } from './users/dto/change-password.dto';
import { TokenPayload } from './users/dto/get-user.dto';
import { UsersService } from './users/users.service';
@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
    @Inject(MAILING_SERVICE) private readonly mailingService: ClientProxy,
  ) {}
  getHello(): string {
    return 'Hello Test Auto deploy is it M';
  }

  async login(user: UserDocument, response: Response) {
    const tokenPayload: TokenPayload = {
      userId: user._id.toHexString(),
    };

    const expires = new Date();
    expires.setSeconds(
      expires.getSeconds() + this.configService.get('JWT_EXPIRATION'),
    );
    const refreshTokenExpiry = new Date();
    refreshTokenExpiry.setSeconds(
      refreshTokenExpiry.getSeconds() +
        this.configService.get('JWT_REFRESH_EXPIRATION'),
    );
    // switch to access token and refresh token
    const refreshToken = this.jwtService.sign(tokenPayload, {
      secret: this.configService.get('JWT_REFRESH_SECRET'),
    });
    const accessToken = this.jwtService.sign(tokenPayload, {
      secret: this.configService.get('JWT_SECRET'),
    });
    // const token = this.jwtService.sign(tokenPayload);
    // response.cookie('Authentication', token, {
    //   httpOnly: true,
    //   expires,
    // });
    response.cookie('accessToken', accessToken, {
      httpOnly: true,
      expires,
    });
    response.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      expires: refreshTokenExpiry,
    });
    await this.usersService.update(user._id.toHexString(), {
      refreshToken,
    });
    return user;
  }

  async verifyEmail(
    token: string,
    requestObj: ExpressRequest,
    response: Response,
  ) {
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
    // will redirectUrl to login page when frontend is ready
    const redirectUrl =
      requestObj.protocol + '://' + requestObj.get('host')
        ? requestObj.get('host') + '/auth/login'
        : `localhost:${this.configService.get('PORT')}` + '/auth/login';
    return response.redirect(redirectUrl);
  }

  async resendVerifyEmail(user: UserDocument, Request: ExpressRequest) {
    const { unHashedToken, hashedToken, tokenExpiry } =
      await this.usersService.generateTemporaryToken();
    user.emailVerificationToken = hashedToken;
    user.emailVerificationExpiry = tokenExpiry;
    await this.usersService.update(user._id.toHexString(), user);
    const url = `${Request.protocol}://${Request.get('host')}/auth/verify-email/${unHashedToken}`;
    this.mailingService.emit('mail_notify', {
      email: user.email,
      subject: 'Verify Email',
      html: `
              <h1 style=" text-align: center" >Verify Email</h1>
              <p>Verify your email address to continue for full access</p>
              <p>${user.email} email address</p>
              <a href="${url}">Click here to verify your email</a>
              `,
    });
    return unHashedToken;
  }

  async changePassword(
    user: UserDocument,
    changePasswordDto: ChangePasswordDto,
    response: Response,
  ) {
    const isPasswordMatch = await bcrypt.compare(
      changePasswordDto.currentPassword,
      user.password,
    );
    if (!isPasswordMatch) {
      throw new Error('Old password is incorrect');
    }
    user.password = await bcrypt.hash(changePasswordDto.newPassword, 10);
    await this.usersService.update(user._id.toHexString(), user);
    response.cookie('Authentication', '', {
      expires: new Date(),
    });
    return user;
  }

  async forgotPassword(
    email: string,
    request: ExpressRequest,
    response: Response,
  ) {
    const user = await this.usersService.findOne(
      { email },
      'User Not Found for ' + email,
    );
    if (!user) {
      throw new Error('User Not Found');
    }
    const { unHashedToken, hashedToken, tokenExpiry } =
      await this.usersService.generateTemporaryToken();
    user.forgotPasswordToken = hashedToken;
    user.forgotPasswordExpiry = tokenExpiry;
    await this.usersService.update(user._id.toHexString(), user);

    const url = `${request.protocol}://${request.get('host')}/auth/verify-email/${unHashedToken}`;
    this.mailingService.emit('mail_notify', {
      email: user.email,
      subject: 'Reset Password',
      html: `
              <h1 style=" text-align: center" >Reset Password</h1>
              <p>Reset your password to continue for full access</p>
              <p>${user.email} email address</p>
              <a href="${url}">Click here to reset your password</a>
              `,
    });
    return response.redirect(`mailto:${user.email}`);
  }

  async resetPassword(resetToken: string, password: string) {
    const hashedToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');
    const user = await this.usersService.findOne(
      {
        forgotPasswordToken: hashedToken,
      },
      'Invalid Token',
    );
    if (user.forgotPasswordExpiry < Date.now()) {
      throw new Error('Token expired');
    }
    user.password = await bcrypt.hash(password, 10);
    user.forgotPasswordToken = null;
    user.forgotPasswordExpiry = null;
    await this.usersService.update(user._id.toHexString(), user);
    return user;
  }
  async logout(user: UserDocument, response: Response) {
    response.cookie('Authentication', '', {
      expires: new Date(),
    });
    await this.usersService.update(user._id.toHexString(), {
      refreshToken: null,
    });
    const options = {
      httpOnly: true,
      secure: true,
    };

    response
      .clearCookie('accessToken', options)
      .clearCookie('refreshToken', options)
      .clearCookie('Authentication', options);
    return {
      sucess: true,
      message: 'Logged out successfully',
    };
  }

  async refreshToken(user: UserDocument, response: Response) {
    const expires = new Date();
    expires.setSeconds(
      expires.getSeconds() + this.configService.get<number>('JWT_EXPIRATION'),
    );
    const accessToken = this.jwtService.sign(
      {
        userId: user._id,
      },
      {
        secret: this.configService.get('JWT_SECRET'),
      },
    );
    response.cookie('accessToken', accessToken, {
      expires,
      httpOnly: true,
    });
    return {
      sucess: true,
      message: 'Logged in successfully',
    };
  }
}
