/* eslint-disable @typescript-eslint/no-unused-vars */
import { Entity, Column, ObjectIdColumn } from 'typeorm';
import { BaseEntity } from './base/base.entity';
import { Room } from './room.entity';
import { Log } from './log.entity';

/**
 * A Sensor.
 */
@Entity('sensor')
export class Sensor extends BaseEntity {
  @Column({ name: 'type', nullable: true })
  type: string;

  @Column({ type: 'integer', name: 'pin', nullable: true })
  pin: number;

  // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove

  @Column(type => Log)
  logs?: Log[] = [];

}
