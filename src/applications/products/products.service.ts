import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  CreateProductDTO,
  CreateProductFilesDTO,
} from 'src/infrastructures/dto/products';
import { S3Service } from '../s3/s3.service';
import {
  ProductRepository,
  UserRepository,
} from './../../infrastructures/repository';

@Injectable()
export class ProductsService {
  constructor(
    private readonly productRepository: ProductRepository,
    private readonly userRepository: UserRepository,
    private readonly s3Service: S3Service,
  ) {}

  async createProduct(
    dto: CreateProductDTO,
    ownerId: number,
    files: CreateProductFilesDTO,
  ) {
    const owner = await this.userRepository.findOne({
      id: ownerId,
    });

    if (!owner) throw new BadRequestException('owner is not found');

    await this.s3Service.uploadFile(files['source'][0]);
    const sourceUrl = await this.s3Service.getSignedUrl(
      files['source'][0].originalname,
    );

    const newProduct = this.productRepository.create({
      ...dto,
      owner,
      codeUrl: sourceUrl,
    });

    if (files['images']) {
      await this.s3Service.uploadFile(files['images'][0]);
      const imageUrl = await this.s3Service.getSignedUrl(
        files['images'][0].originalname,
      );

      newProduct.imageUrl = imageUrl;
    }

    await this.productRepository.persistAndFlush(newProduct);

    return { title: newProduct.title, createdAt: newProduct.createdAt };
  }

  async findProduct(productId: number) {
    const product = await this.productRepository.findOne({
      id: productId,
    });

    if (!product) throw new NotFoundException('product is not exists');

    return product;
  }
}
