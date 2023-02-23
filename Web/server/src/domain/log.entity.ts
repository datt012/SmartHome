/* eslint-disable @typescript-eslint/no-unused-vars */
import { Column, Entity } from 'typeorm';
import { BaseEntity } from './base/base.entity';

/**
 * A Log.
 */
@Entity('log')
export class Log extends BaseEntity {

  @Column({ name: 'description', nullable: true })
  description: string;

  @Column({ type: 'date', name: 'created_at', nullable: true })
  createdAt: any;

  // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove

}
