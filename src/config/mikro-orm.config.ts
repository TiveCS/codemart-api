/* istanbul ignore file */

import { Options } from '@mikro-orm/core';
import { PostgreSqlDriver } from '@mikro-orm/postgresql';

export default (): Options<PostgreSqlDriver> => {
  return {
    entities: ['dist/**/*.entity.js'],
    entitiesTs: ['src/**/*.entity.ts'],
    dbName: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    type: 'postgresql',
    migrations: {
      tableName: 'mikro_orm_migrations',
      path: 'src/infrastructures/database/migrations',
      transactional: true,
      emit: 'ts',
      snapshot: false,
    },
  };
};
