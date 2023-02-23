/* eslint-disable @typescript-eslint/no-unused-vars */
import { Column, Entity, ObjectIdColumn } from 'typeorm';
import { BaseEntity } from './base/base.entity';

import { Status } from './enumeration/status';
import { Log } from './log.entity';
import { Room } from './room.entity';

/**
 * A Device.
 */
@Entity('device')
export class Device extends BaseEntity {
  @Column({ type: 'simple-enum', name: 'status', enum: Status })
  status: Status;

  @Column({ name: 'type', nullable: true })
  type: string;

  @Column({ type: 'integer', name: 'pin', nullable: true })
  pin: number;

  // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
  @Column(type => Log)
  logs?: Log[] = [];
}
