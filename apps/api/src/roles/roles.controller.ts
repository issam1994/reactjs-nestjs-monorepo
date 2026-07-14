import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  Put,
} from '@nestjs/common';
import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { RequirePermissions } from 'src/permissions/decorators/required-permissions.decorator';
import { GetRolesDto } from './dto/get-roles.dto';

@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Post()
  @RequirePermissions('role:create')
  create(@Body() createRoleDto: CreateRoleDto) {
    return this.rolesService.create(createRoleDto);
  }

  @Get()
  @RequirePermissions('role:read')
  findAll(@Query() query: GetRolesDto) {
    return this.rolesService.findAll(query);
  }

  @Get(':id')
  @RequirePermissions('role:read')
  findOne(@Param('id') id: string) {
    return this.rolesService.findOne(+id);
  }

  @Patch(':id')
  @RequirePermissions('role:update')
  update(@Param('id') id: string, @Body() updateRoleDto: UpdateRoleDto) {
    return this.rolesService.update(+id, updateRoleDto);
  }

  @Delete(':id')
  @RequirePermissions('role:delete')
  remove(@Param('id') id: string) {
    return this.rolesService.remove(+id);
  }

  @Put(':id/permissions')
  @RequirePermissions('role:update')
  updatePermissions(
    @Param('id') id: string,
    @Body('permissions') permissions: string[],
  ) {
    return this.rolesService.updatePermissions(+id, permissions);
  }
}
