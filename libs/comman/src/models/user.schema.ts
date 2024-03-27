import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsEmail, IsEnum, IsOptional, IsString } from 'class-validator';
import {
  UserRolesEnum,
  AvailableSocialLogins,
  AbstractDocument,
} from '@app/comman';
@Schema({ timestamps: true })
export class UserDocument extends AbstractDocument {
  @Prop({
    type: {
      url: { type: String },
      localPath: { type: String },
    },
    default: {
      url: 'https://via.placeholder.com/200x200.png',
      localPath: '',
    },
  })
  @IsOptional()
  avatar: { url: string; localPath: string };

  @Prop({
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    index: true,
  })
  @IsString()
  @IsOptional()
  username: string;

  @Prop({ required: true, unique: true, lowercase: true, trim: true })
  @IsEmail()
  email: string;

  @Prop({
    type: String,
    enum: UserRolesEnum,
    default: UserRolesEnum.USER,
    required: true,
  })
  @IsEnum(UserRolesEnum)
  @IsOptional()
  role?: string;

  @Prop({ required: [true, 'Password is required'] })
  @IsString()
  password: string;

  @Prop({
    type: String,
    enum: AvailableSocialLogins,
    default: AvailableSocialLogins.EMAIL_PASSWORD,
  })
  @IsEnum(AvailableSocialLogins)
  @IsOptional()
  loginType?: string;

  @Prop({ default: false })
  @IsOptional()
  isEmailVerified: boolean;

  @Prop()
  refreshToken: string;

  @Prop()
  forgotPasswordToken: string;

  @Prop()
  forgotPasswordExpiry: number;

  @Prop()
  emailVerificationToken: string;

  @Prop()
  emailVerificationExpiry: number;
}

export const UserSchema = SchemaFactory.createForClass(UserDocument);
