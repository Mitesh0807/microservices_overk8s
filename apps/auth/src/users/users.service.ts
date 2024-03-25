import {
  Inject,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { CreateUserDto } from './dto/create-user.dto';
import {
  MAILING_SERVICE,
  USER_TEMPORARY_TOKEN_EXPIRY,
  UserRolesEnum,
} from '@app/comman';
import * as bcrypt from 'bcryptjs';
import * as crypto from 'crypto';
import { ClientProxy } from '@nestjs/microservices';
import { Request } from 'express';

@Injectable()
export class UsersService {
  constructor(
    private readonly usersRepository: UsersRepository,
    @Inject(MAILING_SERVICE) private readonly mailingService: ClientProxy,
  ) {}

  async create(createUserDto: CreateUserDto, Request: Request) {
    await this.validateCreateUserDto(createUserDto);
    const { unHashedToken, hashedToken, tokenExpiry } =
      await this.generateTemporaryToken();
    const url = `${Request.protocol}://${Request.get('host')}/auth/verify-email?token=${unHashedToken}`;
    this.mailingService.emit('mail_notify', {
      email: createUserDto.email,
      subject: 'Verify Email',
      html: `<a href="${url}">Click here to verify your email</a>`,
    });
    return this.usersRepository.create({
      ...createUserDto,
      role: UserRolesEnum.USER,
      password: await bcrypt.hash(createUserDto.password, 10),
      refreshToken: 'testing',
      forgotPasswordToken: 'testing',
      forgotPasswordExpiry: new Date(),
      emailVerificationToken: hashedToken,
      emailVerificationExpiry: tokenExpiry,
      avatar: {
        url: 'https://via.placeholder.com/200x200.png',
        localPath: '',
      },
      isEmailVerified: false,
    });
  }

  private async validateCreateUserDto(createUserDto: CreateUserDto) {
    try {
      await this.usersRepository.findOne({
        $or: [
          { email: createUserDto.email },
          { username: createUserDto.username },
        ],
      });
    } catch (err) {
      return;
    }
    throw new UnprocessableEntityException('Email already exists.');
  }

  private async generateTemporaryToken() {
    const unHashedToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto
      .createHash('sha256')
      .update(unHashedToken)
      .digest('hex');
    const tokenExpiry = Date.now() + USER_TEMPORARY_TOKEN_EXPIRY;
    return {
      unHashedToken,
      hashedToken,
      tokenExpiry,
    };
  }

  async verifyUser(email: string, password: string) {
    const user = await this.usersRepository.findOne({
      $or: [{ email }, { username: email }],
    });
    if (!user) {
      throw new UnprocessableEntityException('Invalid credentials');
    }
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      throw new UnprocessableEntityException('Invalid credentials');
    }
    return user;
  }
}
