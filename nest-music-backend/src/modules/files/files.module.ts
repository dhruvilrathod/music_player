import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { FilesService } from './files.service';
import { FilesController } from './files.controller';
import { ValidateFileMiddleware } from 'src/middlewares/validate-file/validate-file.middleware';
import { PlayerService } from '../player/player.service';

@Module({
  providers: [FilesService, PlayerService],
  controllers: [FilesController]
})
export class FilesModule {
}
