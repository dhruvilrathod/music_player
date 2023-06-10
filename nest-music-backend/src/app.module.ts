import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FilesModule } from './modules/files/files.module';
import { PlayerModule } from './modules/player/player.module';

@Module({
  imports: [
    FilesModule, 
    PlayerModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
