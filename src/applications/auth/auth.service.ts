import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/sqlite';
import {
  BadRequestException,
  Injectable,
  ForbiddenException,
} from '@nestjs/common';
import { User } from '../../domains/entities';
import { RegisterDTO, LoginDTO } from '../../infrastructures/dto/auth';
import * as argon2 from 'argon2';
import { UniqueConstraintViolationException } from '@mikro-orm/core';
import { JwtPayload, Tokens } from './types';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: EntityRepository<User>,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async register(dto: RegisterDTO) {
    const { email, fullName, password } = dto;

    const hashedPassword = await argon2.hash(password);

    const newUser = this.userRepository.create({
      email,
      fullName,
      password: hashedPassword,
    });

    try {
      await this.userRepository.persistAndFlush(newUser);

      return { fullName: newUser.fullName };
    } catch (error) {
      if (error instanceof UniqueConstraintViolationException) {
        throw new BadRequestException('user with this email is exists');
      }
    }
  }

  async login(dto: LoginDTO) {
    const { email, password } = dto;

    const user: User = await this.userRepository.findOne({
      email,
    });

    if (!user) throw new ForbiddenException('invalid credentials');

    const isVerified = await argon2.verify(user.password, password);

    if (!isVerified) throw new ForbiddenException('invalid credentials');

    // Generate token
    return this.generateTokens({ email, fullName: user.fullName });
  }

  async generateTokens(payload: JwtPayload): Promise<Tokens> {
    const accessTokenPromise = this.jwtService.signAsync(payload);
    const refreshTokenPromise = this.jwtService.signAsync(
      { email: payload.email },
      {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
        expiresIn: this.configService.get<string>('JWT_REFRESH_EXPIRES'),
      },
    );

    const [access_token, refresh_token] = await Promise.all([
      accessTokenPromise,
      refreshTokenPromise,
    ]);

    return { access_token, refresh_token };
  }
}
