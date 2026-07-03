import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({ origin: [/localhost:\d+$/, /yourdomain\.com$/], credentials: true });
  app.setGlobalPrefix("api");
  await app.listen(process.env.API_PORT ? Number(process.env.API_PORT) : 4000);
}

bootstrap();
