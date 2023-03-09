import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { GetUser } from '../auth/decorators';
import { JwtAccessGuard } from '../auth/guards';
import {
  CreateProductDTO,
  CreateProductFilesDTO,
} from './../../infrastructures/dto/products';
import { ProductsService } from './products.service';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @UseGuards(JwtAccessGuard)
  @UseInterceptors(
    FileFieldsInterceptor([
      {
        name: 'images',
      },
      {
        name: 'source',
        maxCount: 1,
      },
    ]),
  )
  @Post()
  async createProduct(
    @Body() dto: CreateProductDTO,
    @GetUser('sub') ownerId: number,
    @UploadedFiles() files: CreateProductFilesDTO,
  ) {
    return this.productsService.createProduct(dto, ownerId, files);
  }

  @Get(':productId')
  async findProductById(@Param('productId', ParseIntPipe) productId: number) {
    return this.productsService.findProduct(productId);
  }
}
