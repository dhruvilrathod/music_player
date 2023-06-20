import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FilesModule } from './modules/files/files.module';
import { PlayerModule } from './modules/player/player.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { AppRoutingModule } from './app-routing.module';
import { enviornment } from './environment/environment';

@Module({
    imports: [
        AppRoutingModule,
        FilesModule,
        PlayerModule,
        ServeStaticModule.forRoot({
            rootPath: (join(__dirname, enviornment.staticAssetsFrontend)),
        })
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {
}
