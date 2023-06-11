import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { FilesService } from './files.service';
import { FilesController } from './files.controller';
import { ValidateFileMiddleware } from 'src/middlewares/validate-file/validate-file.middleware';

@Module({
  providers: [FilesService],
  controllers: [FilesController]
})
export class FilesModule {
}
