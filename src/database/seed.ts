import 'reflect-metadata';
import 'dotenv/config';

import { DataSource } from 'typeorm';
import { ormConfig } from '@/config/ormconfig';
import { seedMockData } from './seeds/mock-data.seed';

async function bootstrap() {
  const dataSource = new DataSource({
    ...ormConfig,
    logging: ['error'],
  });

  await dataSource.initialize();

  try {
    await seedMockData(dataSource);
    console.log('✅ Đã tạo dữ liệu mẫu thành công.');
  } finally {
    await dataSource.destroy();
  }
}

bootstrap().catch((error) => {
  console.error('❌ Tạo dữ liệu mẫu thất bại:', error);
  process.exit(1);
});
