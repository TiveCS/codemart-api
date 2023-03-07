import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { Product, User } from './../../domains/entities';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';

@Module({
  imports: [MikroOrmModule.forFeature([Product, User])],
  providers: [ProductsService],
  controllers: [ProductsController],
})
export class ProductsModule {}
