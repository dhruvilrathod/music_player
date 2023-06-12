import { HttpErrorResponse } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { ResponseMessage, CustomNotification, MusicHistory } from 'src/app/interfaces';
import { HttpService } from 'src/app/services/http/http.service';
import { NotificationService } from 'src/app/services/notification/notification.service';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss'],
    host: {
        '(window:resize)': 'onResize($event)'
    }
})
export class HomeComponent implements OnInit {

    public currentTab: number = 1;
    public currentPlaylist!: string;
    public allPlaylists!: string[];
    public currentSong!: string;
    public allSongsInPlaylist!: string[];
    public lastMusicDuration: number | undefined;

    constructor(
        private _notificationService: NotificationService,
        private _httpService: HttpService
    ) { }

    ngOnInit(): void {
        this.tabChange(2);
        this._getAllPlaylists();
    }

    public tabChange(tabIndex: number): void {
        if (this.currentTab == tabIndex) return;
        let scrollWidth = document.getElementById('player')?.parentElement?.offsetWidth;
        switch (tabIndex) {
            case 1:
                console.log("switch to tab 1");
                document.getElementById('listing')!.style.transform = `translateX(0px)`;
                document.getElementById('player')!.style.transform = `translateX(0px)`;
                this.currentTab = 1;
                break;
            case 2:
                console.log("switch to tab 2");
                document.getElementById('listing')!.style.transform = `translateX(-${scrollWidth}px)`;
                document.getElementById('player')!.style.transform = `translateX(-${scrollWidth}px)`;
                this.currentTab = 2;
                break;
            default:
                break;
        }
    }

    private _getAllPlaylists(): void {
        let tempObservable: Subscription = this._httpService.getAllPlaylists().subscribe({
            next: (playlists: string[]) => this.allPlaylists = playlists,
            error: (err: HttpErrorResponse) => {
                this._notificationService.showNotification(new CustomNotification(err.error.message ?? 'Something went wrong', true, 3, err.error.body ?? err.error.error ?? '')); console.log(err);
                this.allPlaylists = [];
            },
            complete: () => {
                tempObservable.unsubscribe();
                this._getCacheData();
            }
        })
    }

    private _getCacheData(): void {
        let tempObservable: Subscription = this._httpService.getPlayerHistory().subscribe({
            next: (music: MusicHistory) => {
                this.currentPlaylist = music.playlistName!;
                this.lastMusicDuration = music.pauseDuration!;
                this.currentSong = music.musicName!;
            },
            error: (err: HttpErrorResponse) => this._notificationService.showNotification(new CustomNotification(err.error.message ?? 'Something went wrong', true, 3, err.error.body ?? err.error.error ?? '')),
            complete: () => {
                tempObservable.unsubscribe();
            }
        })
    }

    public onResize(e: Event) {
        let resizeSize = document.getElementById('player')?.parentElement?.offsetWidth;
        document.getElementById('player')!.style.width = `${resizeSize}px`;
        document.getElementById('listing')!.style.width = `${resizeSize}px`;
        if(this.currentTab === 2) {
            document.getElementById('listing')!.style.transform = `translateX(-${resizeSize}px)`;
            document.getElementById('player')!.style.transform = `translateX(-${resizeSize}px)`;
        }
    }


}
