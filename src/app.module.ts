import { AuthModule } from './applications/auth/auth.module';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ProductsModule } from './applications/products/products.module';
import { S3Module } from './applications/s3/s3.module';

import mikroOrmConfig from './config/mikro-orm.config';
import { validate } from './config/validations';

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
    S3Module,
  ],
})
export class AppModule {}
