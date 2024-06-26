import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { HealthModule, LoggerModule, MAILING_SERVICE } from '@app/comman';
import { UsersModule } from './users/users.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as Joi from 'joi';
import { JwtStrategy } from './users/strategies/jwt.strategy';
import { LocalStategy } from './users/strategies/local.strategy';
import { JwtModule } from '@nestjs/jwt';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { RefreshJwtStrategy } from './users/strategies/refresh-jwt.strategy';
@Module({
  imports: [
    LoggerModule,
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        MONGODB_URI: Joi.string().required(),
        JWT_SECRET: Joi.string().required(),
        JWT_EXPIRATION: Joi.string().required(),
        MAILING_HOST: Joi.string().required(),
        MAILING_PORT: Joi.number().required(),
        PORT: Joi.number().required(),
        JWT_REFRESH_SECRET: Joi.string().required(),
      }),
    }),
    JwtModule.register({}),
    ClientsModule.registerAsync([
      {
        name: MAILING_SERVICE,
        useFactory: (configService: ConfigService) => ({
          transport: Transport.TCP,
          options: {
            host: configService.get('MAILING_HOST'),
            port: configService.get('MAILING_PORT'),
          },
        }),
        inject: [ConfigService],
      },
    ]),
    UsersModule,
    HealthModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, LocalStategy, RefreshJwtStrategy],
})
export class AuthModule {}
