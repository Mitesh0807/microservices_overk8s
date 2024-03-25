import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { CreateUserDto } from './dto/create-user.dto';
import { USER_TEMPORARY_TOKEN_EXPIRY, UserRolesEnum } from '@app/comman';
import * as bcrypt from 'bcryptjs';
import * as crypto from 'crypto';
@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async create(createUserDto: CreateUserDto) {
    await this.validateCreateUserDto(createUserDto);
    const { unHashedToken, hashedToken, tokenExpiry } =
      await this.generateTemporaryToken();
    // will send to email microservice
    return this.usersRepository.create({
      ...createUserDto,
      role: UserRolesEnum.USER,
      password: await bcrypt.hash(createUserDto.password, 10),
      refreshToken: 'testing',
      forgotPasswordToken: 'testing',
      forgotPasswordExpiry: new Date(),
      emailVerificationToken: 'testing',
      emailVerificationExpiry: new Date(),
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
