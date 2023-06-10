import { AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';


const jsmediatags = (window as any).jsmediatags;

@Component({
    selector: 'app-player',
    templateUrl: './player.component.html',
    styleUrls: ['./player.component.scss']
})
export class PlayerComponent implements OnInit, AfterViewInit {

    @Input() fileSrc: string = 'assets/1.flac';
    @Input() fileName: string = '1.flac';
    @Input() fileType: string = 'audio/flac';


    // @Input() fileSrc:string = 'assets/2.mp3';
    // @Input() fileName: string = '2.mp3';
    // @Input() fileType: string = 'audio/mp3';


    @ViewChild('audio') audioTag!: ElementRef;
    @ViewChild('musicLogo') musicLogo!:ElementRef;

    public isPlaying: boolean = false;
    public isLoading: boolean = false;
    public player!: HTMLAudioElement;
    public currentTime!: number;
    public duration!: number;
    public sliderValue!: number;

    public song: any;


    ngOnInit(): void {
        this.isLoading = true;
    }

    ngAfterViewInit(): void {
        window.addEventListener("keydown", (e) => {
            if (e.code == "Space") {
                this.isPlaying = !this.isPlaying;
                this.toggleAudio(this.isPlaying);
            }
        });
        this.createFile(this.fileSrc, this.fileName, this.fileType).then((file: File) => {
            jsmediatags.read(file, {
                onSuccess: (songObj: any) => {
                    this.song = songObj;
                    const data = songObj.tags.picture.data
                    const format = songObj.tags.picture.format
                    let base64String = ""
                    for (let i = 0; i < data.length; i++) {
                        base64String += String.fromCharCode(data[i])
                    }
                    (this.musicLogo.nativeElement as HTMLImageElement).src = `data:${format};base64,${window.btoa(base64String)}`
                    this.isLoading = false;
                },
                onError: (err: any) => { console.log(err); this.isLoading = false }
            });

        })

    }

    async createFile(path: string, name: string, type: string): Promise<File> {
        let response = await fetch(path);
        let data = await response.blob();
        let metadata = {
            type: type
        };
        return new File([data], name, metadata);
    }

    public playerRegister(e: Event) {
        this.player = this.audioTag.nativeElement as HTMLAudioElement;
        setInterval(() => {
            this.currentTime = this.player.currentTime * 1000 - 1800000;
            this.sliderValue = Math.floor(this.player.currentTime / this.player.duration * 1000);
        });

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

    public metadataLoaded(e: Event): void {
        console.log((e.target as HTMLAudioElement).attributes);
    }


    public imageError(e:Event): void {
        (e.target as HTMLImageElement).src = "assets/music_placeholder.webp"
    }
}
