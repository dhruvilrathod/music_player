import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { Endpoints, QueryParams } from 'src/app/enums';
import { environment } from 'src/environments/environment.development';


const jsmediatags = (window as any).jsmediatags;

@Component({
    selector: 'app-player',
    templateUrl: './player.component.html',
    styleUrls: ['./player.component.scss']
})
export class PlayerComponent implements OnInit, AfterViewInit, OnChanges {

    @Input() playlist!: string;
    @Input() fileName: string = 'Baarish.mp3';
    @Input() previousFile!: string;
    @Input() nextFile!: string;
    @Input() isPlayerOnScreen!: boolean;

    @Output() currentPlayingSong: EventEmitter<number> = new EventEmitter<number>();

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
        console.log(changes);
        console.log(this.fileName);
        console.log(this.previousFile);
        console.log(this.nextFile);
        console.log(this.playlist);
        if (changes['fileName']) {
            this.tempFileSourceElem = `${environment.baseURL}/${Endpoints.GET_MUSIC_FILE}?${QueryParams.PLAYLIST_NAME}=${this.playlist}&${QueryParams.FILE_NAME}=${this.fileName}`;
            this.tempFileSource = `${Endpoints.GET_MUSIC_FILE}?${QueryParams.PLAYLIST_NAME}=${this.playlist}&${QueryParams.FILE_NAME}=${this.fileName}`;
            console.log(this.tempFileSource);
            this.feedDataToPlayer();
        }
    }


    public feedDataToPlayer(): void {
        this.playlist && this.fileName &&
            this.createFile(this.tempFileSourceElem, this.fileName, `audio/${this.fileName.split('.').pop()}`).then((file: File) => {
                jsmediatags.read(file, {
                    onSuccess: (songObj: any) => {
                        this.song = songObj;
                        console.log(songObj);
                        const data = (songObj.tags.picture) ? songObj.tags.picture.data : '';
                        const format = (songObj.tags.picture) ? songObj.tags.picture.format: '';
                        let base64String = "";
                        for (let i = 0; i < data.length; i++) {
                            base64String += String.fromCharCode(data[i])
                        }
                        (this.musicLogo.nativeElement as HTMLImageElement).src = `data:${format};base64,${window.btoa(base64String)}`;

                        let elemParent = this.audioTagContainer.nativeElement as HTMLDivElement;
                        elemParent.innerHTML = `<audio id="audio"> <source src="${this.tempFileSourceElem}" type="audio/*"> </audio>`;

                        (elemParent.firstChild as HTMLAudioElement).onloadeddata = function (e) {
                            console.log("bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb");
                            
                        }
                        
                        console.log('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa', (elemParent.firstChild as HTMLAudioElement).duration);

                        setInterval(() => {
                            this.currentTime = (elemParent.firstChild as HTMLAudioElement).currentTime * 1000 - 1800000;
                            this.sliderValue = Math.floor((elemParent.firstChild as HTMLAudioElement).currentTime / (elemParent.firstChild as HTMLAudioElement).duration * 1000);
                        }, 1000);

                        setInterval(() => {
                            if ((elemParent.firstChild as HTMLAudioElement).duration > 0 && !(elemParent.firstChild as HTMLAudioElement).paused)
                                console.log("update server", (elemParent.firstChild as HTMLAudioElement).currentTime);
                        }, 1000)

                        this.isLoading = false;
                    },
                    onError: (err: any) => { console.log(err); this.isLoading = false }
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
        console.log('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa', this.player.duration);

        setInterval(() => {
            this.currentTime = this.player.currentTime * 1000 - 1800000;
            this.sliderValue = Math.floor(this.player.currentTime / this.player.duration * 1000);
        }, 1000);

        setInterval(() => {
            if (this.player.duration > 0 && !this.player.paused)
                console.log("update server", this.player.currentTime);
        }, 1000)
    }


    public toggleAudio(value: boolean): void {
        this.isPlaying = value;
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
}
