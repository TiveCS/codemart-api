import { Entity, PrimaryKey, Property } from '@mikro-orm/core';
import { UserRepository } from './../../infrastructures/repository/user.repository';

@Entity({ customRepository: () => UserRepository })
export class User {
  @PrimaryKey({
    autoincrement: true,
  })
  id: number;

  @Property({
    unique: true,
  })
  email: string;

  @Property()
  fullName: string;

  @Property()
  password: string;
}
