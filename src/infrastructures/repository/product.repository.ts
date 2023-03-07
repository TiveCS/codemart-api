import { Product } from './../../domains/entities/product.entity';
import { EntityRepository } from '@mikro-orm/core';

export class ProductRepository extends EntityRepository<Product> {}
