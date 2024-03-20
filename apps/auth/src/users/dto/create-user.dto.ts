import { UserRolesEnum } from '@app/comman/constants';
import {
  IsEmail,
  IsEnum,
  IsLowercase,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsStrongPassword,
  Length,
} from 'class-validator';

export class CreateUserDto {
  @IsEmail({}, { message: 'Email is invalid' })
  @IsNotEmpty({ message: 'Email is required' })
  email: string;

  @IsNotEmpty({ message: 'Username is required' })
  @IsString()
  @IsLowercase({ message: 'Username must be lowercase' })
  @Length(3, undefined, {
    message: 'Username must be at least 3 characters long',
  })
  username: string;

  @IsStrongPassword()
  password: string;

  @IsEnum(UserRolesEnum, { message: 'Invalid user role' })
  @IsOptional()
  role?: string;
}
