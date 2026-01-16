// src/utils/entity-discovery.ts
import { DataSource } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';

@Injectable()
export class EntityDiscoveryService {
  constructor(@InjectDataSource() private dataSource: DataSource) {}

  // Method 1: Get entities from TypeORM DataSource (Runtime - Best for seeding)
  getEntityNamesFromDataSource(): string[] {
    const entities = this.dataSource.entityMetadatas;

    return entities
      .map((entity) => {
        return entity.name.toLowerCase();
      })
      .filter((name) => {
        // Filter out junction tables and RBAC tables
        return !name.includes('_') && !['role', 'permission'].includes(name);
      });
  }

  // Method 2: Get entities with full metadata
  getEntityMetadata() {
    return this.dataSource.entityMetadatas.map((entity) => ({
      name: entity.name,
      tableName: entity.tableName,
      targetName: entity.targetName,
      columns: entity.columns.map((col) => col.propertyName),
    }));
  }

  // Method 3: Filter entities by pattern
  getEntityNamesByPattern(includePattern?: RegExp, excludePattern?: RegExp) {
    return this.dataSource.entityMetadatas
      .filter((entity) => {
        const name = entity.tableName.toLowerCase();
        if (excludePattern && excludePattern.test(name)) return false;
        if (includePattern && !includePattern.test(name)) return false;
        return true;
      })
      .map((entity) => entity.tableName.toLowerCase());
  }
}
