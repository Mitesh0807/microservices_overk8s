import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { HealthModule, LoggerModule } from '@app/comman';
import { UsersModule } from './users/users.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as Joi from 'joi';
import { JwtStrategy } from './users/strategies/jwt.strategy';
import { LocalStategy } from './users/strategies/local.strategy';
import { JwtModule } from '@nestjs/jwt';
@Module({
  imports: [
    LoggerModule,
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        MONGODB_URI: Joi.string().required(),
      }),
    }),
    JwtModule.registerAsync({
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: `${configService.get('JWT_EXPIRATION')}s`,
        },
      }),
      inject: [ConfigService],
    }),
    UsersModule,
    HealthModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, LocalStategy],
})
export class AuthModule { }
