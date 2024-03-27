import { IsNotEmpty, IsString, Length } from 'class-validator';

export class ChangePasswordDto {
  @IsNotEmpty()
  @IsString()
  @Length(6, undefined, {
    message: 'Password must be at least 6 characters long',
  })
  currentPassword: string;

  @IsNotEmpty()
  @IsString()
  @Length(6, undefined, {
    message: 'Password must be at least 6 characters long',
  })
  newPassword: string;
}
