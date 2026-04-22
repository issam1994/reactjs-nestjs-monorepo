import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import { ResourceEnum } from '../enums/resource.enum';
import { ActionEnum } from '../enums/action.enum';
import { Role } from 'src/roles/entities/role.entity';

@Entity('permission')
@Unique(['resource', 'action'])
export class Permission {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  resource: ResourceEnum;
  @Column()
  action: ActionEnum;
  @ManyToMany(() => Role, (role) => role.permissions)
  roles: Role[];
  @CreateDateColumn()
  createdAt: Date;
  @UpdateDateColumn()
  updatedAt: Date;
}
