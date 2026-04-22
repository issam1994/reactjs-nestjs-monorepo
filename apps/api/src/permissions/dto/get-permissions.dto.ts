import { IsOptional } from 'class-validator';
import { paginationDto } from 'src/common/pagination/dto/pagination.dto';
import { ResourceEnum } from '../enums/resource.enum';

export class GetPermissionsDto extends paginationDto {
  @IsOptional()
  search: ResourceEnum | undefined;
}
