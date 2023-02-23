/* eslint-disable @typescript-eslint/no-unused-vars */
import { Column, Entity, ObjectIdColumn } from 'typeorm';
import { BaseEntity } from './base/base.entity';
import { Room } from './room.entity';
import { User } from './user.entity';
import { Permission } from './permission.entity';

/**
 * A HomePage.
 */
@Entity('home')
export class Home extends BaseEntity {
  @Column({ name: 'name', nullable: true })
  name: string;

  @Column({ name: 'location', nullable: true })
  location: string;

  // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
  @Column(type => Room)
  rooms?: Room[] = [];

  @Column(type => Permission)
  permissions?: Permission[] = [];
}
