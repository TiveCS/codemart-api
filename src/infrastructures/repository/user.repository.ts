import { User } from './../../domains/entities/user.entity';
import { EntityRepository } from '@mikro-orm/core';

export class UserRepository extends EntityRepository<User> {}
