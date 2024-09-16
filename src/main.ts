import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { ValidationPipe } from '@nestjs/common';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';
import { AllExceptionsFilter } from './common/filtrers/all-exceptions.filter';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  //app.useGlobalGuards(new JwtAuthGuard());
  // Apply ValidationPipe globally to catch validation errors
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true, // Strips any properties that are not in the DTO
    forbidNonWhitelisted: true, // Throws an error when non-whitelisted properties are present
    transform: true, // Automatically transforms request payloads to DTO instances
  }));

  // Apply the response format interceptor globally
  app.useGlobalInterceptors(new ResponseInterceptor());

  // Apply the global exception filter
  app.useGlobalFilters(new AllExceptionsFilter());

  await app.listen(3000);
}
bootstrap();
