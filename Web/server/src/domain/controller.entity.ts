/* eslint-disable @typescript-eslint/no-unused-vars */
import { Entity, Column, ObjectIdColumn } from 'typeorm';
import { BaseEntity } from './base/base.entity';
import { Sensor } from './sensor.entity';
import { Device } from './device.entity';

/**
 * A Controller.
 */
@Entity('controller')
export class Controller extends BaseEntity {
  @Column({ name: 'uuid', nullable: true })
  uuid: string;

  // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
  @Column(type => Sensor)
  sensors?: Sensor[] = [];

  @Column(type => Device)
  devices?: Device[] = [];
}
