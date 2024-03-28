import { CurrentUser, UserDocument } from '@app/comman';
import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  Res,
  UnprocessableEntityException,
  UseGuards,
} from '@nestjs/common';
import { Request as ExpressRequest, Response } from 'express';
import { AuthService } from './auth.service';
import { ChangePasswordDto } from './users/dto/change-password.dto';
import { JwtAuthGuard } from './users/guards/jwt-auth.guard';
import { LocalAuthGuard } from './users/guards/local-auth.guard';
import { RefreshJwtTokenGuard } from './users/guards/refresh-jwt-token.guard';
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get()
  getHello(): string {
    return this.authService.getHello();
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(
    @CurrentUser() user: UserDocument,
    @Res({ passthrough: true }) response: Response,
  ) {
    return await this.authService.login(user, response);
  }

  @Get('verify-email/:token')
  async verifyEmail(
    @Param('token') token: string,
    @Req() Request: ExpressRequest,
    @Res() response: Response,
  ) {
    return await this.authService.verifyEmail(token, Request, response);
  }

  @UseGuards(JwtAuthGuard)
  @Get('resend-verify-email')
  async resendVerifyEmail(
    @CurrentUser() user: UserDocument,
    @Req() Request: ExpressRequest,
  ) {
    if (user.isEmailVerified) {
      throw new UnprocessableEntityException('Email already verified');
    }
    return await this.authService.resendVerifyEmail(user, Request);
  }

  @UseGuards(JwtAuthGuard)
  @Post('change-password')
  async changePassword(
    @CurrentUser() user: UserDocument,
    @Body() changePasswordDto: ChangePasswordDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    return await this.authService.changePassword(
      user,
      changePasswordDto,
      response,
    );
  }

  // frontend url will be sent to user email with reset password link
  @Post('forgot-password')
  async forgotPassword(
    @Body('email') email: string,
    @Req() request: ExpressRequest,
    @Res({ passthrough: true }) response: Response,
  ) {
    return await this.authService.forgotPassword(email, request, response);
  }

  @Post('reset-password/:resetToken')
  async resetPassword(
    @Param('resetToken') resetToken: string,
    @Body('password') password: string,
  ) {
    return await this.authService.resetPassword(resetToken, password);
  }

  // @UseGuards(LocalAuthGuard)
  // @Get('refresh-token')
  // async refreshToken(@CurrentUser() user: UserDocument) {
  //   return await this.authService.refreshToken(user);
  // }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  async logout(
    @CurrentUser() user: UserDocument,
    @Res({ passthrough: true }) response: Response,
  ) {
    return await this.authService.logout(user, response);
  }

  @UseGuards(RefreshJwtTokenGuard)
  @Get('refresh-token')
  async refreshToken(
    @CurrentUser() user: UserDocument,
    @Res({ passthrough: true }) response: Response,
  ) {
    return await this.authService.refreshToken(user, response);
  }
}
