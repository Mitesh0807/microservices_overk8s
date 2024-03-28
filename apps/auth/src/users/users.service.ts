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
  UserDocument,
  UserRolesEnum,
} from '@app/comman';
import * as bcrypt from 'bcryptjs';
import * as crypto from 'crypto';
import { ClientProxy } from '@nestjs/microservices';
import { Request } from 'express';
import { FilterQuery } from 'mongoose';
import { GetUserDto } from './dto/get-user.dto';

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
    const url = `${Request.protocol}://${Request.get('host')}/auth/verify-email/${unHashedToken}`;
    this.mailingService.emit('mail_notify', {
      email: createUserDto.email,
      subject: 'Verify Email',
      html: `
              <h1 style=" text-align: center" >Verify Email</h1>
              <p>Verify your email address to continue for full access</p>
              <p>${createUserDto.email} email address</p>
              <a href="${url}">Click here to verify your email</a>
              `,
    });
    return this.usersRepository.create({
      ...createUserDto,
      role: UserRolesEnum.USER,
      password: await bcrypt.hash(createUserDto.password, 10),
      refreshToken: null,
      forgotPasswordToken: 'testing',
      forgotPasswordExpiry: null,
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

  async generateTemporaryToken() {
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
  async getUser(_id: GetUserDto) {
    return this.usersRepository.findOne(_id);
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
    if (!user.isEmailVerified) {
      throw new UnprocessableEntityException('Email not verified');
    }
    delete user.password;
    delete user.forgotPasswordToken;
    delete user.forgotPasswordExpiry;
    delete user.emailVerificationToken;
    delete user.emailVerificationExpiry;
    delete user.refreshToken;
    delete user.isEmailVerified;
    return user;
  }

  async findOne(
    filter: FilterQuery<UserDocument>,
    notFoundExceptionMessage?: string,
  ) {
    return this.usersRepository.findOne(filter, [], notFoundExceptionMessage);
  }

  async update(id: string, updateUserDto: Partial<UserDocument>) {
    return this.usersRepository.findOneAndUpdate({ _id: id }, updateUserDto);
  }
}
