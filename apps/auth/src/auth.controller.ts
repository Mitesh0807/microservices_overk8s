import { CurrentUser, UserDocument } from '@app/comman';
import {
  Controller,
  Get,
  Param,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Response, Request as ExpressRequest } from 'express';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './users/guards/local-auth.guard';
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

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
    const jwt = await this.authService.login(user, response);
    return user;
  }

  @Get('verify-email/:token')
  async verifyEmail(
    @Param('token') token: string,
    @Req() Request: ExpressRequest,
    @Res() response: Response
  ) {
    return await this.authService.verifyEmail(token, Request, response);
  }
}
