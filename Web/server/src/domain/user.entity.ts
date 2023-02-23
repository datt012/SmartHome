import { Authority } from './authority.entity';
import { Column, Entity } from 'typeorm';
import { BaseEntity } from './base/base.entity';
import { Exclude } from 'class-transformer';
import { Permission } from './permission.entity';

@Entity('nhi_user')
export class User extends BaseEntity {
  @Column({ unique: true })
  login: string;
  @Column({ nullable: true })
  firstName?: string;
  @Column({ nullable: true })
  lastName?: string;
  @Column()
  email: string;
  @Column({ default: false })
  activated?: boolean;
  @Column({ default: 'en' })
  langKey?: string;

  @Column()
  authorities?: Authority[];

  @Column({
    type: 'varchar'
  })
  @Exclude()
  password: string;
  @Column({ nullable: true })
  imageUrl?: string;
  @Column({ nullable: true })
  activationKey?: string;
  @Column({ nullable: true })
  resetKey?: string;
  @Column({ nullable: true })
  resetDate?: Date;

  @Column(type => Permission)
  permissions?: Permission[] = [];
}
