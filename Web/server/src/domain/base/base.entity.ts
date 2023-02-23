import { ObjectIdColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Transform } from 'class-transformer';

export abstract class BaseEntity {
  @ObjectIdColumn({ name: '_id' })
  @Transform(id => (id?.toHexString ? id?.toHexString() : id), { toPlainOnly: true })
  _id?: string;

  @ObjectIdColumn({ name: '_id' })
  id?: string;
  @Column({ nullable: true })
  createdBy?: string;
  @CreateDateColumn({ nullable: true })
  createdDate?: Date;
  @Column({ nullable: true })
  lastModifiedBy?: string;
  @UpdateDateColumn({ nullable: true })
  lastModifiedDate?: Date;
}
