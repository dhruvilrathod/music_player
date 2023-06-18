import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as path from 'path';
import { enviornment } from './enviornment/enviornment';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.enableCors();
  app.useStaticAssets(path.join(__dirname + enviornment.staticAssetsUpload));
  app.useStaticAssets(path.join(__dirname + enviornment.staticAssetsFrontend));
  await app.listen(26091);
}
bootstrap();
