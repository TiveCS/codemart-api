/* istanbul ignore file */

import { EntityName } from '@mikro-orm/core';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import {
  DynamicModule,
  ForwardReference,
  Provider,
  Type,
} from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { S3Module } from '../../src/applications/s3/s3.module';
import mikroOrmConfig from '../../src/config/mikro-orm.config';

export default async function createTestModule({
  providers = [],
  controllers = [],
  entities,
  imports = [],
}: {
  providers?: Provider<any>[];
  controllers?: Type<any>[];
  entities?: EntityName<Partial<any>>[];
  imports?: (
    | Type<any>
    | DynamicModule
    | Promise<DynamicModule>
    | ForwardReference<any>
  )[];
}): Promise<TestingModule> {
  const modulesToImport = [
    ConfigModule.forRoot({
      envFilePath: '.env.test',
    }),
    MikroOrmModule.forRoot({
      ...mikroOrmConfig(),
      allowGlobalContext: true,
    }),
    ...imports,
  ];

  console.log(modulesToImport);

  if (entities && entities.length > 0)
    modulesToImport.push(MikroOrmModule.forFeature({ entities }));

  const app = await Test.createTestingModule({
    imports: modulesToImport,
    providers,
    controllers,
  }).compile();

  return app;
}
