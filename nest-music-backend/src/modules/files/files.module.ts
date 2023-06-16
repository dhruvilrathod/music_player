import { Module} from '@nestjs/common';
import { FilesService } from './files.service';
import { FilesController } from './files.controller';
import { PlayerService } from '../player/player.service';

@Module({
  providers: [FilesService, PlayerService],
  controllers: [FilesController]
})
export class FilesModule {
}
