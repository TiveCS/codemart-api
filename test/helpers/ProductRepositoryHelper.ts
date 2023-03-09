import { Product, User } from './../../src/domains/entities';
import { MikroORM, FilterQuery } from '@mikro-orm/core';
import { ProductRepository } from './../../src/infrastructures/repository';
export const ProductRepositoryHelper = {
  async create(
    orm: MikroORM,
    repo: ProductRepository,
    {
      title = 'untitled product',
      description = 'lorem ipsum',
      version = '1.0.0',
      codeUrl = 'http://github.com/TiveCS/codemart',
      imageUrl = 'http://nonexists.com/img.png',
      createdAt = new Date(),
      updatedAt = new Date(),
      owner_id = 1,
      id = 1,
    },
  ) {
    const user = await orm.em.getRepository(User).findOne({
      id: owner_id,
    });

    const product = repo.create({
      id,
      title,
      description,
      owner: user,
      version,
      codeUrl,
      imageUrl,
      createdAt,
      updatedAt,
    });

    await repo.persistAndFlush(product);
  },

  async find(repo: ProductRepository, where: FilterQuery<Product>) {
    return repo.findOne(where);
  },
};
