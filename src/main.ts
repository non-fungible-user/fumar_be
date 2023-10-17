import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors();
  // app.use(
  //   rateLimit({
  //     windowMs: 60 * 60 * 1000, // 1 minute
  //     max: 5, // Max 5 requests per minute per IP
  //   })
  // );

  await app.listen(3001);
}
bootstrap();
