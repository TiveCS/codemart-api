import { MikroORM } from '@mikro-orm/core';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TestingModule } from '@nestjs/testing';
import { S3 } from 'aws-sdk';
import { MulterHelperFile } from '../../../../test/helpers/MulterFileHelper';
import createTestModule from '../../../../test/helpers/TestModuleHelper';
import { ProductsService } from '../products.service';
import { ProductRepositoryHelper } from './../../../../test/helpers/ProductRepositoryHelper';
import { UserRepositoryHelper } from './../../../../test/helpers/UserRepositoryHelper';
import { Product } from './../../../domains/entities';
import { User } from './../../../domains/entities/user.entity';
import { CreateProductDTO } from './../../../infrastructures/dto/products';
import {
  ProductRepository,
  UserRepository,
} from './../../../infrastructures/repository';
import { S3Service } from './../../s3/s3.service';

describe('ProductsService', () => {
  let app: TestingModule;
  let orm: MikroORM;
  let productRepository: ProductRepository;
  let userRepository: UserRepository;
  let productsService: ProductsService;

  beforeAll(async () => {
    app = await createTestModule({
      entities: [Product, User],
      providers: [
        ProductsService,
        S3Service,
        {
          provide: 'AWS_S3_CLIENT',
          inject: [ConfigService],
          useFactory: (config: ConfigService): S3 => {
            const s3 = new S3({
              credentials: {
                accessKeyId: config.get<string>('S3_ACCESS_KEY'),
                secretAccessKey: config.get<string>('S3_SECRET_KEY'),
              },
              endpoint: config.get<string>('S3_ENDPOINT'),
            });
            return s3;
          },
        },
      ],
    });

    orm = app.get<MikroORM>(MikroORM);
    productsService = app.get<ProductsService>(ProductsService);
    productRepository = app.get<ProductRepository>(ProductRepository);
    userRepository = app.get<UserRepository>(UserRepository);
  });

  afterEach(async () => {
    await orm.getSchemaGenerator().clearDatabase();
  });

  afterAll(async () => {
    await orm.close(true);
    await app.close();
  });

  describe('createProduct', () => {
    it('should throw BadRequestException when owner is not exists', async () => {
      const payload: CreateProductDTO = {
        title: 'untitled',
        description: 'lorem ipsum',
        version: '1.0.0',
        codeUrl: 'http://github.com/TiveCS/random-project',
      };

      const sourceFile = MulterHelperFile.toMulter({
        fieldname: 'source',
        buffer: Buffer.from('../../../../test/mocks/files/example-zip.zip'),
        mimetype: 'application/zip',
        originalname: 'example-zip',
      }) as Express.Multer.File;

      // Action & Assert
      await expect(() =>
        productsService.createProduct(payload, 100, {
          source: [sourceFile],
        }),
      ).rejects.toThrowError(BadRequestException);
    });

    it('should persist product correctly', async () => {
      // Arrange
      const userRepository = orm.em.getRepository(User);
      const ownerId = 1;

      await UserRepositoryHelper.createUser(userRepository, {
        id: ownerId,
      });

      const sourceFile = MulterHelperFile.toMulter({
        fieldname: 'source',
        buffer: Buffer.from('../../../../test/mocks/files/example-zip.zip'),
        mimetype: 'application/zip',
        originalname: 'example-zip',
      }) as Express.Multer.File;

      const imageFile = MulterHelperFile.toMulter({
        fieldname: 'images',
        buffer: Buffer.from('../../../../test/mocks/files/example-img.png'),
        mimetype: 'image/png',
        originalname: 'example-img',
      }) as Express.Multer.File;

      const payload: CreateProductDTO = {
        title: 'untitled',
        description: 'lorem ipsum',
        version: '1.0.0',
      };

      // Action
      await productsService.createProduct(payload, ownerId, {
        source: [sourceFile],
        images: [imageFile],
      });

      // Assert
      const found = await ProductRepositoryHelper.find(productRepository, {
        id: 1,
      });

      expect(found.title).toEqual(payload.title);
      expect(found.description).toEqual(payload.description);
      expect(found.version).toEqual(payload.version);
      expect(found.codeUrl).toBeDefined();
      expect(found.imageUrl).toBeDefined();
    });
  });

  describe('findProduct', () => {
    it('should throw NotFoundException when product is not exists', async () => {
      // Arrange
      const productId = 1;

      // Action & Assert
      await expect(() =>
        productsService.findProduct(productId),
      ).rejects.toThrowError(NotFoundException);
    });

    it('should return a product', async () => {
      // Arrange
      const productId = 1;
      const ownerId = 1;
      await UserRepositoryHelper.createUser(userRepository, {
        id: ownerId,
      });

      await ProductRepositoryHelper.create(orm, productRepository, {
        id: productId,
        owner_id: ownerId,
      });

      // Action
      const found = await productsService.findProduct(productId);

      // Assert
      expect(found).toBeDefined();
      expect(found.id).toEqual(productId);
    });
  });
});
