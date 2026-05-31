import { paginationDto } from 'src/common/pagination/dto/pagination.dto';
import { IsOptional } from 'class-validator';

export class GetRolesDto extends paginationDto {
  @IsOptional()
  search: string;
}
