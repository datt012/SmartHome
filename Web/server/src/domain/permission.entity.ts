/* eslint-disable @typescript-eslint/no-unused-vars */
import { Entity, Column } from 'typeorm';
import { BaseEntity } from './base/base.entity';

/**
 * A Permission.
 */
@Entity('permission')
export class Permission extends BaseEntity {

  @Column({ name: 'permission', nullable: true })
  permission: string;

  // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
}
