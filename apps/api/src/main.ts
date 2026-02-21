import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { PermissionsGuard } from './permissions/guards/permissions.guard';
import { PermissionsService } from './permissions/permissions.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // Apply JWT guard globally
  const reflector = app.get(Reflector);
  const permissionsService = app.get(PermissionsService);
  app.useGlobalGuards(
    new JwtAuthGuard(reflector),
    new PermissionsGuard(reflector, permissionsService),
  );
  // enable cors
  app.enableCors();
  //
  await app.listen(process.env.PORT ?? 3000);
}

void bootstrap();
