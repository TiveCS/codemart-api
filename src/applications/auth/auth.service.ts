import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/sqlite';
import { Injectable } from '@nestjs/common';
import { User } from '../../domains/entities';
import { RegisterDTO } from '../../infrastructures/dto/auth/register.dto';
import * as argon2 from 'argon2';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: EntityRepository<User>,
  ) {}

  async register(dto: RegisterDTO) {
    const { email, fullName, password } = dto;

    const hashedPassword = await argon2.hash(password);

    const newUser = this.userRepository.create(
      {
        email,
        fullName,
        password: hashedPassword,
      },
      {
        persist: true,
      },
    );

    return { email: newUser.email, fullName: newUser.fullName };
  }
}
