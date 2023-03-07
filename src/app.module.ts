import { AuthModule } from './applications/auth/auth.module';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import mikroOrmConfig from './config/mikro-orm.config';
import { validate } from './config/validations';
import { ProductsModule } from './applications/products/products.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate,
      envFilePath:
        process.env.NODE_ENV !== 'prod' && `.env.${process.env.NODE_ENV}`,
    }),
    MikroOrmModule.forRootAsync({
      useFactory: async () => mikroOrmConfig(),
    }),
    AuthModule,
    ProductsModule,
  ],
})
export class AppModule {}
