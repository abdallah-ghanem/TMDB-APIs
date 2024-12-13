import { NestFactory } from '@nestjs/core';  
import { AppModule } from './app.module';  
import { ValidationPipe } from '@nestjs/common';  

async function bootstrap() {  
  const app = await NestFactory.create(AppModule);  
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }));  
  await app.listen(3000); // Adjust the port if needed  
  console.log(`Application is running on: http://localhost:3000`);
}  
bootstrap();