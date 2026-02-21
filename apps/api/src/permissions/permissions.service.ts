import { Injectable } from '@nestjs/common';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { UsersService } from 'src/users/users.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Permission } from './entities/permission.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PermissionsService {
  constructor(
    private usersService: UsersService,
    @InjectRepository(Permission)
    private readonly permissionsRepository: Repository<Permission>,
  ) {}
  create(createPermissionDto: CreatePermissionDto) {
    return this.permissionsRepository.create(createPermissionDto);
  }

  findAll() {
    return this.permissionsRepository.find();
  }

  findOne(id: number) {
    return this.permissionsRepository.findOneBy({ id });
  }

  update(id: number, updatePermissionDto: UpdatePermissionDto) {
    return this.permissionsRepository.update(id, updatePermissionDto);
  }

  remove(id: number) {
    return this.permissionsRepository.delete(id);
  }

  async getUserPermissions(id: number) {
    const user = await this.usersService.findOne({
      where: { id },
      relations: { roles: { permissions: true } },
    });
    const permissions = new Set<string>();
    user?.roles.forEach((role) =>
      role.permissions.forEach((permission) =>
        permissions.add(`${permission.resource}:${permission.action}`),
      ),
    );
    return permissions;
  }
}
