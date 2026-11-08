import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  VersionColumn,
} from 'typeorm';

/**
 * Entity gốc chứa các cột dùng chung cho mọi bảng:
 * thời gian tạo/cập nhật/xóa mềm, version (optimistic lock) và trạng thái hoạt động.
 */
export abstract class BaseEntity {
  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at', type: 'timestamp', nullable: true })
  deletedAt?: Date;

  @VersionColumn()
  version: number;

  @Column({ name: 'is_active', type: 'boolean', default: true })
  isActive: boolean;
}

/**
 * Base entity cho bảng dùng khóa chính UUID.
 * Dùng cho các entity mới, các entity cũ vẫn giữ tên khóa chính riêng.
 */
export abstract class BaseUuidEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;
}
