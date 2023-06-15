import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FilesModule } from './modules/files/files.module';
import { PlayerModule } from './modules/player/player.module';
import { ErrorMiddleware } from './middlewares/error/error.middleware';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [
    FilesModule, 
    PlayerModule,
    ServeStaticModule.forRoot({
        rootPath: (join(__dirname, `../frontend/angular-music`)),
    })
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
    configure(frontEnd: MiddlewareConsumer) {
        frontEnd.apply(ErrorMiddleware).forRoutes({
          path: '/**',
          method: RequestMethod.ALL
        });
      }
}
