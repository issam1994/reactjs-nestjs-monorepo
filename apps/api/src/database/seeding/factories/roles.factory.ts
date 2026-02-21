import { INestApplication } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Permission } from 'src/permissions/entities/permission.entity';
import { ActionEnum } from 'src/permissions/enums/action.enum';
import { Role } from 'src/roles/entities/role.entity';
import { Repository } from 'typeorm';

export default class RolesFactory {
  private readonly permissionsRepository: Repository<Permission>;
  private readonly rolesRepository: Repository<Role>;
  constructor(private readonly app: INestApplication) {
    this.permissionsRepository = this.app.get<Repository<Permission>>(
      getRepositoryToken(Permission),
    );
    this.rolesRepository = this.app.get<Repository<Role>>(
      getRepositoryToken(Role),
    );
  }
  async run() {
    // map of roles to be created
    const RolesToCreate = [
      {
        id: 1,
        name: 'user',
        actions: [ActionEnum.READ],
      },
      {
        id: 2,
        name: 'admin',
        // will get all permissions
        actions: Object.values(ActionEnum),
      },
    ];
    const roles: Partial<Role>[] = [];
    // fetch all permissions from database
    const permissions = await this.permissionsRepository.find({
      select: ['action', 'id'],
    });
    // create roles and link them to permissions
    RolesToCreate.forEach(({ name, id, actions }) => {
      roles.push({
        id,
        name,
        permissions: permissions.filter((permission) =>
          // keep the permission if it contains the action allowed for the role
          actions?.includes(permission.action),
        ),
      });
    });
    // save in db
    try {
      await this.rolesRepository.save(roles, { transaction: false });
    } catch (e) {
      console.log('error during roles creation, maybe duplicates or : ', e);
    }
  }
}
