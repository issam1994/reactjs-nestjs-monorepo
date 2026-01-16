import { NestFactory } from '@nestjs/core';
import { AppModule } from 'src/app.module';
import PermissionsFactory from './factories/permissions.factory';
import RolesFactory from './factories/roles.factory';
import UsersFactory from './factories/users.factory';

async function bootstrap() {
  console.log('seeding app starts....');
  const app = await NestFactory.create(AppModule);
  // order is important :)
  const factories = [
    {
      name: 'permissions',
      seeder: new PermissionsFactory(app),
    },
    {
      name: 'roles',
      seeder: new RolesFactory(app),
    },
    {
      name: 'users',
      seeder: new UsersFactory(app),
    },
  ];
  // loop through seeders
  for (const factory of factories) {
    console.log(`seeding ${factory.name} starts`);
    try {
      await factory.seeder.run();
      // seeding ended
      console.log(`seeding ${factory.name} finished`);
    } catch (e) {
      // seeding error
      console.error(`seeding ${factory.name} error`, e);
    }
  }
  // close seeding app
  console.log('seeding app closing....');
  await app.close();
}

bootstrap().catch((err) => {
  console.error('seeding app error....', err);
  process.exit(1);
});
