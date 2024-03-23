import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { HealthModule, LoggerModule } from '@app/comman';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
import { JwtStrategy } from './users/strategies/jwt.strategy';
import { LocalStategy } from './users/strategies/local.strategy';
@Module({
  imports: [
    LoggerModule,
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        MONGODB_URI: Joi.string().required(),
      }),
    }),
    UsersModule,
    HealthModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, LocalStategy],
})
export class AuthModule {}
