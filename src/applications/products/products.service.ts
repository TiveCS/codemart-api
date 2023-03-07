import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateProductDTO } from 'src/infrastructures/dto/products';
import {
  ProductRepository,
  UserRepository,
} from './../../infrastructures/repository';

@Injectable()
export class ProductsService {
  constructor(
    private readonly productRepository: ProductRepository,
    private readonly userRepository: UserRepository,
  ) {}

  async createProduct(dto: CreateProductDTO, ownerId: number) {
    const owner = await this.userRepository.findOne({
      id: ownerId,
    });

    if (!owner) throw new BadRequestException('owner is not found');

    const newProduct = this.productRepository.create({
      ...dto,
      owner,
    });

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
