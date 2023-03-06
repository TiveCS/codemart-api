import { FilterQuery } from '@mikro-orm/core';
import { User } from '../../src/domains/entities';
import { UserRepository } from './../../src/infrastructures/repository';

export const UserRepositoryHelper = {
  async createUser(
    repo: UserRepository,
    {
      id = 1,
      email = 'test@gmail.com',
      password = '1234567',
      fullName = 'Ahmad Subarjo',
    },
  ) {
    repo.create(
      {
        id,
        email,
        password,
        fullName,
      },
      {
        persist: true,
      },
    );
  },

  async findById(repo: UserRepository, where: FilterQuery<User>) {
    return repo.findOne(where);
  },
};
