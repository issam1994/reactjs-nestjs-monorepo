import { IsEmail, IsNotEmpty } from 'class-validator';
import { Role } from 'src/roles/entities/role.entity';

export class CreateUserDto {
  @IsNotEmpty()
  firstName: string;

  @IsNotEmpty()
  lastName: string;

  @IsEmail()
  email: string;

  @IsNotEmpty()
  gender: 'male' | 'female' | 'other';

  @IsNotEmpty()
  mobileNumber: string;

  @IsNotEmpty()
  password: string;

  roles: Role[] | undefined;
}
