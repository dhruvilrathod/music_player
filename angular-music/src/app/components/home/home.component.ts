import { HttpErrorResponse } from '@angular/common/http';
import { Component, ComponentRef, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { CustomNotification, MusicHistory, ResponseMessage } from 'src/app/interfaces';
import { HttpService } from 'src/app/services/http/http.service';
import { NotificationService } from 'src/app/services/notification/notification.service';
import { ListingComponent } from '../listing/listing.component';

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
    public currentPlaylistInListing!: string;
    public currentPlaylistInPlayer!: string;
    public allPlaylists!: string[];
    public currentSong!: string;
    public nextSong!: string;
    public previousSong!: string;
    public allSongsInPlaylist!: string[];
    public lastMusicDuration: number | undefined;
    public isPlaying: boolean = false;
    public fromHistroy: boolean = false;
    public emptyPlayer: boolean = false;

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
                document.getElementById('listing')!.style.transform = `translateX(0px)`;
                document.getElementById('player')!.style.transform = `translateX(0px)`;
                this.currentTab = 1;
                break;
            case 2:
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
                this._notificationService.showNotification(new CustomNotification(err.error.message ?? 'Something went wrong', true, 3, err.error.body ?? err.error.error ?? ''));
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
                this.currentPlaylistInPlayer = music.playlistName!;
                this.currentPlaylistInListing = music.playlistName!;
                this.lastMusicDuration = music.pauseDuration!;
                this.currentSong = music.musicName!;
            },
            error: (err: HttpErrorResponse) => this._notificationService.showNotification(new CustomNotification(err.error.message ?? 'Something went wrong', true, 3, err.error.body ?? err.error.error ?? '')),
            complete: () => {
                tempObservable.unsubscribe();
                if (this.currentPlaylistInPlayer || this.currentSong || this.allSongsInPlaylist)
                    this._getSongsInPlaylist();
            }
        })
    }

    private _getSongsInPlaylist(): void {
        if (this.currentPlaylistInPlayer) {
            let tempObservable: Subscription = this._httpService.getMusicsOfPlaylist(this.currentPlaylistInPlayer).subscribe({
                next: (songs: string[]) => { this.allSongsInPlaylist = songs; },
                error: (err: HttpErrorResponse) => {
                    this._notificationService.showNotification(new CustomNotification(err.error.message ?? 'Something went wrong', true, 3, err.error.body ?? err.error.error ?? ''));
                    this.allSongsInPlaylist = [];
                },
                complete: () => {
                    tempObservable.unsubscribe();
                    this.changeCurrentFiles(0, true);
                }
            })
        }
    }

    public updateSongsListing(s: [string[], string]): void {
        this.allSongsInPlaylist = s[0];
        this.currentPlaylistInListing = s[1];
    }

    public changeCurrentFiles(type: number, fromHistroy: boolean, data?: string[]): void {
        this.fromHistroy = fromHistroy;
        if (data) this.currentPlaylistInPlayer = data[1];
        let currentIndex = this.allSongsInPlaylist ? this.allSongsInPlaylist.indexOf(this.currentSong) : 0;
        if (type === 0) {
            this.previousSong = this.allSongsInPlaylist[currentIndex - 1] ?? undefined;
            this.nextSong = this.allSongsInPlaylist[currentIndex + 1] ?? undefined;
        }
        else if (type === 1 && this.allSongsInPlaylist[currentIndex - 1]) {
            this.previousSong = this.allSongsInPlaylist[currentIndex - 2] ?? undefined
            this.currentSong = this.allSongsInPlaylist[currentIndex - 1] ?? undefined
            this.nextSong = this.allSongsInPlaylist[currentIndex] ?? undefined
        }
        else if (type === 2 && this.allSongsInPlaylist[currentIndex + 1]) {
            this.previousSong = this.allSongsInPlaylist[currentIndex] ?? undefined
            this.currentSong = this.allSongsInPlaylist[currentIndex + 1] ?? undefined
            this.nextSong = this.allSongsInPlaylist[currentIndex + 2] ?? undefined
        }
        else if (type === 3) {
            currentIndex = this.allSongsInPlaylist.indexOf(data![0]);
            this.currentSong = this.allSongsInPlaylist[currentIndex] ?? undefined
            this.previousSong = this.allSongsInPlaylist[currentIndex - 1] ?? undefined
            this.nextSong = this.allSongsInPlaylist[currentIndex + 1] ?? undefined
        }
    }

    public onResize(e: Event) {
        let resizeSize = document.getElementById('player')?.parentElement?.offsetWidth;
        document.getElementById('player')!.style.width = `${resizeSize}px`;
        document.getElementById('listing')!.style.width = `${resizeSize}px`;
        if (this.currentTab === 2) {
            document.getElementById('listing')!.style.transform = `translateX(-${resizeSize}px)`;
            document.getElementById('player')!.style.transform = `translateX(-${resizeSize}px)`;
        }
    }


    public clearAllData(): void {
        this.emptyPlayer = true;
        let tempObservable: Subscription = this._httpService.deleteAllData().subscribe({
            next: (m: ResponseMessage) => this._notificationService.showNotification(new CustomNotification(m.message ?? 'Deleted Successful', true, m.code ?? 1, m.body ?? "All the file(s) deleted successfully")),
            error: (err: HttpErrorResponse) => {
                this._notificationService.showNotification(new CustomNotification(err.error.message ?? 'Something went wrong', true, 3, err.error.body ?? err.error.error ?? ''));
                this.emptyPlayer = false;
            },
            complete: () => {
                tempObservable.unsubscribe();
                this.allPlaylists = [];
                this.allSongsInPlaylist = [];
                this.currentPlaylistInListing = '';
                this.currentPlaylistInPlayer = '';
                this.currentSong = '';
                this.emptyPlayer = false;
            }
        });
    }

    public clearCache(): void {
        this.emptyPlayer = true;
        let tempObservable: Subscription = this._httpService.clearCache().subscribe({
            next: (m: ResponseMessage) => this._notificationService.showNotification(new CustomNotification(m.message ?? 'Cache Cleared', true, m.code ?? 1, m.body ?? "The Cache cleared successfully")),
            error: (err: HttpErrorResponse) => {
                this._notificationService.showNotification(new CustomNotification(err.error.message ?? 'Something went wrong', true, 3, err.error.body ?? err.error.error ?? ''));
                this.emptyPlayer = false
            },
            complete: () => {
                tempObservable.unsubscribe();
                this.currentPlaylistInPlayer = '';
                this.currentSong = '';
                this.emptyPlayer = false;
            }
        });
    }

}
