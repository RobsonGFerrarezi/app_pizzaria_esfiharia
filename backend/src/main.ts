import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('APP')
    .setDescription('Documentação da API para o APP')
    .setVersion('1.0.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api', app, document);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Remove propriedades não listadas no DTO (bom para segurança)
      forbidNonWhitelisted: true, // Lança erro se propriedades extras forem enviadas
      transform: true, // <--- ESTA É A CORREÇÃO!
      transformOptions: {
        enableImplicitConversion: true, // Ajuda na conversão de tipos
      },
    }),
  );

  await app.listen(process.env.PORT ?? 8000);
}
bootstrap();
