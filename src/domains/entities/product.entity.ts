import { ProductRepository } from './../../infrastructures/repository';
import { User } from '../entities';
import { Entity, ManyToOne, PrimaryKey, Property } from '@mikro-orm/core';

@Entity({
  customRepository: () => ProductRepository,
})
export class Product {
  @PrimaryKey()
  id: number;

  @ManyToOne(() => User)
  owner: User;

  @Property()
  title: string;

  @Property()
  description: string;

  @Property()
  version: string;

  @Property({
    nullable: true,
  })
  imageUrl?: string;

  @Property()
  codeUrl: string;

  @Property()
  createdAt: Date = new Date();

  @Property({
    onUpdate: () => new Date(),
  })
  updatedAt: Date = new Date();
}
