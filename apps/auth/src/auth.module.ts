import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { LoggerModule } from '@app/comman';
import { UsersModule } from './users/users.module';

@Module({
  imports: [LoggerModule, UsersModule],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
