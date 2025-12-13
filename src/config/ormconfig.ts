import { join } from 'path';
import {
  DATABASE_HOST,
  DATABASE_NAME,
  DATABASE_PASSWORD,
  DATABASE_PORT,
  DATABASE_USERNAME,
} from './config';

import { MysqlConnectionOptions } from 'typeorm/driver/mysql/MysqlConnectionOptions';

export const ormConfig: MysqlConnectionOptions = {
  type: 'mysql',
  username: DATABASE_USERNAME,
  database: DATABASE_NAME,
  host: DATABASE_HOST,
  port: +DATABASE_PORT,
  password: DATABASE_PASSWORD,
  entities: [join(__dirname, '..', '**', '*.entity.{ts,js}')],
  synchronize: true,
};
