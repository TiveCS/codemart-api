import { CreateProductDTO } from './../../infrastructures/dto/products';
import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { JwtAccessGuard } from '../auth/guards';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @UseGuards(JwtAccessGuard)
  @Post()
  async createProduct(@Body() dto: CreateProductDTO, ownerId: number) {
    return this.productsService.createProduct(dto, ownerId);
  }

  @Get(':productId')
  async findProductById(@Param('productId', ParseIntPipe) productId: number) {
    return this.productsService.findProduct(productId);
  }
}
