import { NestFactory } from '@nestjs/core';
import { AntiFraudServiceModule } from './anti-fraud-service.module';

async function bootstrap() {
  const app = await NestFactory.create(AntiFraudServiceModule);

  await app.listen(process.env.port ?? 3000);
}
bootstrap();
