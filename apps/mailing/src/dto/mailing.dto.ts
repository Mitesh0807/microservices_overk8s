import { IsEmail, IsOptional, IsString } from 'class-validator';

export class NotifyEmailDto {
  @IsEmail()
  email: string;

  @IsString()
  text: string;

  @IsString()
  @IsOptional()
  subject: string;

  @IsString()
  @IsOptional()
  html: string;

  @IsString()
  @IsOptional()
  template: string;

  @IsString()
  @IsOptional()
  templateData: string;

  @IsString()
  @IsOptional()
  url: string;
}
