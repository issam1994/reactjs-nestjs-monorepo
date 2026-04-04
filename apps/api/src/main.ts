import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { PermissionsGuard } from './permissions/guards/permissions.guard';
import { PermissionsService } from './permissions/permissions.service';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // Apply guards globally
  const reflector = app.get(Reflector);
  const permissionsService = app.get(PermissionsService);
  app.useGlobalGuards(
    new JwtAuthGuard(reflector),
    new PermissionsGuard(reflector, permissionsService),
  );
  // global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Strips away non-whitelisted properties
      forbidNonWhitelisted: true, // Throws an error if extra properties exist
      transform: true, // Automatically transforms payloads to be instances of DTO classes
    }),
  );
  // enable cors
  app.enableCors();
  //
  await app.listen(process.env.PORT ?? 3000);
}

void bootstrap();
