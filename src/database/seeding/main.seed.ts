import { faker } from '@faker-js/faker';
import { NestFactory } from '@nestjs/core';
import { AppModule } from 'src/app.module';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';

async function bootstrap() {
  console.log('seeding app starts....');
  const app = await NestFactory.create(AppModule);
  const userRepository = app.get<Repository<User>>(getRepositoryToken(User));
  // seed users
  console.log('seeding users starts....');
  try {
    await userRepository.save(
      new Array(10).fill(null).map(() => ({
        email: faker.internet.email(),
        password: bcrypt.hashSync('password', 10),
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        gender: 'male',
        mobileNumber: faker.phone.number(),
      })),
    );
    console.log('seeding users finished....');
  } catch (e) {
    console.log('seeding users error...', e);
  }
  // close seeding app
  console.log('seeding app closing....');
  await app.close();
}

bootstrap().catch((err) => {
  console.error('seeding app error....', err);
  process.exit(1);
});
