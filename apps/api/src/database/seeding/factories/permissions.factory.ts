import { INestApplication } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Permission } from 'src/permissions/entities/permission.entity';
import { ActionEnum } from 'src/permissions/enums/action.enum';
import { ResourceEnum } from 'src/permissions/enums/resource.enum';
import { Repository } from 'typeorm';

export default class PermissionsFactory {
  private readonly permissionsRepository: Repository<Permission>;
  constructor(private readonly app: INestApplication) {
    this.permissionsRepository = this.app.get<Repository<Permission>>(
      getRepositoryToken(Permission),
    );
  }
  async run() {
    // create data
    const resources = Object.values(ResourceEnum);
    const actions = Object.values(ActionEnum);
    const permissionsForAllResourcesAs2dArray = resources.map((resource, i) => {
      const permissionsForResource: Partial<Permission>[] = actions.map(
        (action, j) => ({
          id: i * actions.length + j + 1,
          action,
          resource,
        }),
      );
      return permissionsForResource;
    });
    // normalize/flatten
    const flattenedPermissions = permissionsForAllResourcesAs2dArray.flat();
    // save in db
    try {
      await this.permissionsRepository.save(flattenedPermissions, {
        transaction: false,
      });
    } catch (e) {
      console.log(
        'error during permissions creation, maybe duplicates or : ',
        e,
      );
    }
  }
}
