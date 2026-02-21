import { faker } from '@faker-js/faker';
import { Role } from 'src/roles/entities/role.entity';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { INestApplication } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';

export default class UsersFactory {
  private readonly usersRepository: Repository<User>;
  private readonly rolesRepository: Repository<Role>;
  private readonly configService: ConfigService;
  constructor(private readonly app: INestApplication) {
    this.usersRepository = this.app.get<Repository<User>>(
      getRepositoryToken(User),
    );
    this.rolesRepository = this.app.get<Repository<Role>>(
      getRepositoryToken(Role),
    );
    this.configService = this.app.get(ConfigService);
  }
  async run() {
    // utility
    const hashPassword = (pass: string) => bcrypt.hashSync(pass, 10);
    // prepare ingredients
    const roles: Role[] = await this.rolesRepository.find();
    const userRole = roles.find(({ name }) => name.toLowerCase() == 'user');
    const adminRole = roles.find(({ name }) => name.toLowerCase() == 'admin');
    // construct users
    const users: Partial<User>[] = new Array(2).fill(null).map(() => ({
      email: faker.internet.email(),
      password: hashPassword('password'),
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      gender: 'male',
      mobileNumber: faker.phone.number(),
      roles: userRole ? [userRole] : [],
    }));
    // make the first user an admin
    users[0].id = 1;
    users[0].email = this.configService.getOrThrow<string>('adminMail');
    users[0].password = hashPassword(
      this.configService.getOrThrow<string>('adminPassword'),
    );
    users[0].roles = adminRole ? [adminRole] : [];
    // save in db
    try {
      await this.usersRepository.save(users, { transaction: false });
    } catch (e) {
      console.log('error during users creation, maybe duplicates or : ', e);
    }
  }
}
