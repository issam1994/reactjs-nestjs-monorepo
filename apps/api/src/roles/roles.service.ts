import { Injectable } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from './entities/role.entity';
import { Repository } from 'typeorm';
import { GetRolesDto } from './dto/get-roles.dto';
import { Permission } from 'src/permissions/entities/permission.entity';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role) private rolesRepository: Repository<Role>,
  ) {}
  create(createRoleDto: CreateRoleDto) {
    return this.rolesRepository.create(createRoleDto);
  }

  async findAll(query: GetRolesDto): Promise<{
    data: Role[];
    meta: GetRolesDto & { total: number; count: number };
  }> {
    const { page, take, search } = query;

    const [data, total] = await this.rolesRepository.findAndCount({
      skip: (page - 1) * take,
      take,
      order: { createdAt: 'DESC' },
    });
    return {
      data,
      meta: {
        search,
        page,
        take,
        total,
        count: data.length,
      },
    };
  }

  findAllWithoutPagination() {
    return this.rolesRepository.find();
  }

  findAllWithPermissions() {
    return this.rolesRepository.find({
      relations: ['permissions'],
      order: { name: 'ASC' },
    });
  }

  findOne(id: number) {
    return this.rolesRepository.findBy({ id });
  }

  update(id: number, updateRoleDto: UpdateRoleDto) {
    return this.rolesRepository.update(id, updateRoleDto);
  }

  remove(id: number) {
    return this.rolesRepository.delete(id);
  }

  async updatePermissions(id: number, permissions: string[]) {
    const role = await this.rolesRepository.findOneBy({ id });
    if (!role) {
      throw new Error('Role not found');
    }
    role.permissions = permissions.map(
      (permission) => ({ id: +permission }) as Permission,
    );
    return this.rolesRepository.save(role);
  }
}
