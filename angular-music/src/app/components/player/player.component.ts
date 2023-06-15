import { HttpErrorResponse } from '@angular/common/http';
import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { Endpoints, QueryParams } from 'src/app/enums';
import { CustomNotification, MusicHistory, ResponseMessage } from 'src/app/interfaces';
import { HttpService } from 'src/app/services/http/http.service';
import { NotificationService } from 'src/app/services/notification/notification.service';
import { environment } from 'src/environments/environment.development';


const jsmediatags = (window as any).jsmediatags;

@Component({
    selector: 'app-player',
    templateUrl: './player.component.html',
    styleUrls: ['./player.component.scss']
})
export class PlayerComponent implements OnInit, AfterViewInit, OnChanges {

    @Input() playlist!: string;
    @Input() fileName!: string;
    @Input() previousFile!: string;
    @Input() nextFile!: string;
    @Input() isPlayerOnScreen!: boolean;
    @Input() fromHistory!: boolean;

    @Output() currentPlayingSong: EventEmitter<number> = new EventEmitter<number>();
    @Output() toggleAudioOutput: EventEmitter<boolean> = new EventEmitter<boolean>();

    @ViewChild('audio') audioTag!: ElementRef;
    @ViewChild('audioTagContainer') audioTagContainer!: ElementRef;
    @ViewChild('musicLogo') musicLogo!: ElementRef;

    @Input() isPlaying: boolean = false;
    public isLoading: boolean = false;
    public player!: HTMLAudioElement;
    public currentTime!: number;
    public duration!: number;
    public sliderValue!: number;

    public Endpoints = Endpoints;
    public QueryParams = QueryParams;

    public tempFileSource!: string;
    public tempFileSourceElem!: string;

    public song: any;

    constructor(
        private _notificationService: NotificationService,
        private _httpService: HttpService
    ) { }


    ngOnInit(): void {
        this.isLoading = true;
        this.feedDataToPlayer();
    }

    ngAfterViewInit(): void {
        window.addEventListener("keydown", (e) => {
            if (this.isPlayerOnScreen === true && e.code === "Space") {
                this.isPlaying = !this.isPlaying;
                this.toggleAudio(this.isPlaying);
            }
        });
    }

    ngOnChanges(changes: SimpleChanges): void {

        if (changes['fileName']) {
            this.tempFileSourceElem = `${environment.baseURL}/${Endpoints.GET_MUSIC_FILE}?${QueryParams.PLAYLIST_NAME}=${this.playlist}&${QueryParams.FILE_NAME}=${this.fileName}`;
            this.tempFileSource = `${Endpoints.GET_MUSIC_FILE}?${QueryParams.PLAYLIST_NAME}=${this.playlist}&${QueryParams.FILE_NAME}=${this.fileName}`;
            this.feedDataToPlayer();
        }

        if (changes['isPlaying']) {
            if (this.player) this.toggleAudio(changes['isPlaying'].currentValue);
        }
    }


    public feedDataToPlayer(): void {
        this.playlist && this.fileName != undefined &&
            this.createFile(this.tempFileSourceElem, this.fileName, `audio/${this.fileName.split('.').pop()}`).then((file: File) => {
                jsmediatags.read(file, {
                    onSuccess: (songObj: any) => {
                        this.song = songObj;
                        const data = (songObj.tags.picture) ? songObj.tags.picture.data : '';
                        const format = (songObj.tags.picture) ? songObj.tags.picture.format : '';
                        let base64String = "";
                        for (let i = 0; i < data.length; i++) {
                            base64String += String.fromCharCode(data[i])
                        }
                        (this.musicLogo.nativeElement as HTMLImageElement).src = `data:${format};base64,${window.btoa(base64String)}`;

                        this.player = this.audioTag.nativeElement;
                        this.player.load();
                        this.player.addEventListener("loadeddata", this.playerRegister.bind(this));
                        this.player.addEventListener("ended", this.songEnded.bind(this), { once: true});
                        this.isLoading = false;
                    },
                    onError: (err: any) => { this.isLoading = false }
                });
            });
    }

    async createFile(path: string, name: string, type: string): Promise<File> {
        let response = await fetch(path);
        let data = await response.blob();
        let metadata = {
            type: type
        };
        return new File([data], name, metadata);
    }

    public playerRegister() {
        setInterval(() => {
            this.currentTime = this.player.currentTime * 1000 - 1800000;
            this.sliderValue = Math.floor(this.player.currentTime / this.player.duration * 1000);
            if (this.player.duration > 0 && !this.player.paused)
                this._updateMusicHistory();
        }, 1000);

        this.toggleAudio(this.fromHistory ? false : true);
    }

    public songEnded() {
        if (this.nextFile) {
            setTimeout(() => {
                this.fileChange(2);
                this.player.removeEventListener("ended",(e) => { console.log("listener removed") });
            }, 2000);
        }

    }


    public toggleAudio(value: boolean): void {
        this.isPlaying = value;
        this.toggleAudioOutput.emit(value);
        if (value)
            this.player.play();
        else {
            this.player.pause();
        }
    }

    public fileChange(type: number) {
        this.currentPlayingSong.emit(type);
    }

    public imageError(e: Event): void {
        (e.target as HTMLImageElement).src = "assets/music_placeholder.webp"
    }

    public changeCurrentTime(e: Event) {
        this.player.currentTime = (parseInt((e.target as HTMLInputElement).value) * this.player.duration) / 1000;
    }

    private _updateMusicHistory(): void {
        let history: MusicHistory = {
            musicName: this.fileName,
            playlistName: this.playlist,
            pauseDuration: this.player.duration
        }
        let tempObservable: Subscription = this._httpService.setPlayerHistory(history).subscribe({
            next: (res: ResponseMessage) => { },
            error: (err: HttpErrorResponse) => { },
            complete: () => {
                tempObservable.unsubscribe();
            }
        })
    }
}
