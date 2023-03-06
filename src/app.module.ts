import { AuthModule } from './applications/auth/auth.module';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';

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
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
