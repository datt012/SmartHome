/* eslint-disable @typescript-eslint/no-unused-vars */
import { Column, Entity, ObjectID, ObjectIdColumn } from 'typeorm';
import { BaseEntity } from './base/base.entity';
import { Device } from './device.entity';
import { Home } from './home.entity';
import { Controller } from './controller.entity';

/**
 * A Room.
 */
@Entity('room')
export class Room extends BaseEntity {
  @Column({ name: 'name', nullable: true })
  name: string;
  // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
  @Column(type => Controller)
  controllers?: Controller[] = []; // ???

}
