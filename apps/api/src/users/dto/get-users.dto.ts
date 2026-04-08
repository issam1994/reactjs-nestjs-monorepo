import { IsOptional } from 'class-validator';
import { paginationDto } from 'src/common/pagination/dto/pagination.dto';

export class getUsersDto extends paginationDto {
  @IsOptional()
  search: string = '';
}
