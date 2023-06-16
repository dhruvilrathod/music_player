import { RouterModule, Routes } from "@nestjs/core";
import { AppModule } from "./app.module";
import { FilesModule } from "./modules/files/files.module";
import { PlayerModule } from "./modules/player/player.module";
import { Module } from "@nestjs/common";

const routes: Routes = [
    {
        path: 'api',
        module: AppModule,
        children: [
            {
                path: 'files',
                module: FilesModule
            },
            {
                path: 'player',
                module: PlayerModule
            }
        ]
    }
]

@Module({
    imports: [RouterModule.register(routes)],
    exports: [AppRoutingModule]
})

export class AppRoutingModule { }