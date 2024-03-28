import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersService } from '../users.service';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import { RefreshTokenPayload } from '../interfaces/token-payload.interface';

@Injectable()
export class RefreshJwtStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(
    configService: ConfigService,
    private readonly usersSerivce: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          const cookies = request.cookies;
          const refreshToken = cookies.refreshToken;
          if (!refreshToken) {
            throw new UnauthorizedException(
              'No refresh token in cookies please redirect to login',
            );
          }
          return refreshToken;
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: configService.get('JWT_REFRESH_SECRET'),
      passReqToCallback: true,
    });
  }
  async validate(request: Request, payload: RefreshTokenPayload) {
    const user = await this.usersSerivce.getUser({ _id: payload.userId });
    if (!user) {
      throw new UnauthorizedException('No user found');
    }
    const { refreshToken } = user;
    if (!refreshToken) {
      throw new UnauthorizedException('No refresh token found');
    }
    if (refreshToken !== request.cookies.refreshToken) {
      throw new UnauthorizedException('Invalid refresh token');
    }
    return user;
  }
}
