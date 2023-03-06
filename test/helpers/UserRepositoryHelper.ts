/* istanbul ignore file */

import { FilterQuery } from '@mikro-orm/core';
import { User } from '../../src/domains/entities';
import { UserRepository } from './../../src/infrastructures/repository';
import * as argon2 from 'argon2';

export const UserRepositoryHelper = {
  async createUser(
    repo: UserRepository,
    {
      id = 1,
      email = 'test@gmail.com',
      password = '1234567',
      fullName = 'Ahmad Subarjo',
    },
    options?: { hashPassword?: boolean },
  ) {
    const user = repo.create({
      id,
      email,
      password: options?.hashPassword ? await argon2.hash(password) : password,
      fullName,
    });

    await repo.persistAndFlush(user);
  },

  async findById(repo: UserRepository, where: FilterQuery<User>) {
    return repo.findOne(where);
  },
};
