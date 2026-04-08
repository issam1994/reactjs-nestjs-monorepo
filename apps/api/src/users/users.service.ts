import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOneOptions, ILike, Repository } from 'typeorm';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { RolesService } from 'src/roles/roles.service';
import { getUsersDto } from './dto/get-users.dto';

@Injectable()
export class UsersService {
  constructor(
    private rolesService: RolesService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}
  async create(createUserDto: CreateUserDto) {
    // prepare user
    const user = this.userRepository.create(createUserDto);
    // check email is unique
    const userWithEmailAlreadyExists = await this.findOne({
      where: { email: user.email },
    });
    if (userWithEmailAlreadyExists) {
      throw new BadRequestException('email already used');
    }
    // hash password before saving
    user.password = bcrypt.hashSync(user.password, 10);
    // attach role user
    const roles = await this.rolesService.findAll();
    const roleUser = roles.find((role) => role.name == 'user');
    if (roleUser) user.roles = [roleUser];

    // save user to database
    return this.userRepository.save(user);
  }

  async findAll(query: getUsersDto) {
    const { page, take, search } = query;
    const [data, count] = await this.userRepository.findAndCount({
      where: [
        {
          email: ILike(`%${search}%`),
        },
        {
          firstName: ILike(`%${search}%`),
        },
        {
          lastName: ILike(`%${search}%`),
        },
      ],
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
        count,
      },
    };
  }

  findOneById(id: number) {
    return this.userRepository.findOneBy({ id });
  }

  findOne(options: FindOneOptions<User>) {
    return this.userRepository.findOne(options);
  }

  findOneByEmailAndPassword(email: string) {
    return this.userRepository.findOne({
      where: { email },
      select: { password: true, id: true, email: true },
    });
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return this.userRepository.update(id, updateUserDto);
  }

  remove(id: number) {
    return this.userRepository.delete(id);
  }
}
