import { Product } from './../../domains/entities/product.entity';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { ProductsController } from './products.controller';

@Module({
  imports: [MikroOrmModule.forFeature([Product])],
  providers: [],
  controllers: [ProductsController],
})
export class ProductsModule {}
