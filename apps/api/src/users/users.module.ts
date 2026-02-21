import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User } from './entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Permission } from 'src/permissions/entities/permission.entity';
import { RolesModule } from 'src/roles/roles.module';
import { Role } from 'src/roles/entities/role.entity';
import { PermissionsModule } from 'src/permissions/permissions.module';
@Module({
  imports: [
    RolesModule,
    PermissionsModule,
    TypeOrmModule.forFeature([User, Permission, Role]),
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
