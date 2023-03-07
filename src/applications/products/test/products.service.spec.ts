import { User } from './../../../domains/entities/user.entity';
import { UserRepositoryHelper } from './../../../../test/helpers/UserRepositoryHelper';
import { ProductRepository } from './../../../infrastructures/repository';
import { ProductRepositoryHelper } from './../../../../test/helpers/ProductRepositoryHelper';
import { CreateProductDTO } from './../../../infrastructures/dto/products';
import { Product } from './../../../domains/entities';
import { MikroORM } from '@mikro-orm/core';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { TestingModule } from '@nestjs/testing';
import createTestModule from '../../../../test/helpers/TestModuleHelper';
import { ProductsService } from '../products.service';

describe('ProductsService', () => {
  let app: TestingModule;
  let orm: MikroORM;
  let productRepository: ProductRepository;
  let productsService: ProductsService;

  beforeAll(async () => {
    app = await createTestModule({
      imports: [MikroOrmModule.forFeature([Product])],
      providers: [ProductsService],
    });

    orm = app.get<MikroORM>(MikroORM);
    productsService = app.get<ProductsService>(ProductsService);

    await orm.getSchemaGenerator().refreshDatabase();
  });

  afterEach(async () => {
    await orm.getSchemaGenerator().clearDatabase();
  });

  afterAll(async () => {
    await orm.close(true);
    await app.close();
  });

  describe('createProduct', () => {
    it('should persist product correctly', async () => {
      // Arrange
      const userRepository = orm.em.getRepository(User);
      await UserRepositoryHelper.createUser(userRepository, {});

      const payload: CreateProductDTO = {
        title: 'untitled',
        description: 'lorem ipsum',
        version: '1.0.0',
        codeUrl: 'http://github.com/TiveCS/random-project',
      };

      // Action
      await productsService.uploadProduct(payload);

      // Assert
      const found = await ProductRepositoryHelper.find(productRepository, {
        id: 1,
      });

      expect(found.title).toEqual(payload.title);
      expect(found.description).toEqual(payload.description);
      expect(found.version).toEqual(payload.version);
      expect(found.codeUrl).toEqual(payload.codeUrl);
    });
  });
});
