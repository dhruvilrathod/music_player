import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Subscription } from 'rxjs';
import { CustomNotification, MusicHistory, ResponseMessage } from 'src/app/interfaces';
import { HttpService } from 'src/app/services/http/http.service';
import { NotificationService } from 'src/app/services/notification/notification.service';

@Component({
    selector: 'app-listing',
    templateUrl: './listing.component.html',
    styleUrls: ['./listing.component.scss']
})
export class ListingComponent implements OnInit {

    private _playlistToUpdate!: string;

    @Input() currentPlaylist!: string;
    @Input() allPlaylists!: string[];
    @Input() currentSong!: string;
    @Input() isPlaying!: boolean;

    @Output() newSongToPlay: EventEmitter<string> = new EventEmitter<string>();
    @Output() toggleSongOutput: EventEmitter<boolean> = new EventEmitter<boolean>();
    @Output() allSongsInCurrentPlaylistOutput: EventEmitter<[string[], string]> = new EventEmitter<[string[], string]>();

    public allSongsInCurrentPlaylist!: string[];
    public isAddigPlaylist: boolean = false;
    public isUpdatingPlaylist: boolean = false;


    constructor(
        private _notificationService: NotificationService,
        private _httpService: HttpService
    ) { }

    ngOnInit(): void {
        console.log(this.allPlaylists);
        console.log(this.currentPlaylist);
        console.log(this.currentSong);
        console.log(this.allSongsInCurrentPlaylist);

        // this.allPlaylists = ['abcd', 'adfasdfsdf'];
        // this.currentPlaylist = this.allPlaylists[0];
        this.playlistSelected('aaa');
    }

    private _getSongsInPlaylist(): void {
        if (this.currentPlaylist) {
            let tempObservable: Subscription = this._httpService.getMusicsOfPlaylist(this.currentPlaylist).subscribe({
                next: (songs: string[]) => { this.allSongsInCurrentPlaylist = songs; },
                error: (err: HttpErrorResponse) => {
                    this._notificationService.showNotification(new CustomNotification(err.error.message ?? 'Something went wrong', true, 3, err.error.body ?? err.error.error ?? ''));
                    this.allSongsInCurrentPlaylist = [];
                    this.allSongsInCurrentPlaylistOutput.emit([[], this.currentPlaylist]);
                },
                complete: () => {                    
                    tempObservable.unsubscribe();
                    console.log(this.allSongsInCurrentPlaylist);
                    this.allSongsInCurrentPlaylistOutput.emit([this.allSongsInCurrentPlaylist, this.currentPlaylist]);
                }
            })
        }
    }

    public songSelectedToPlay(s: string) {        
        this.newSongToPlay.emit(s);
        this.toggleSongOutput.emit(true);
    }

    public filesSelected(e: Event): void {
        console.log((e.target as HTMLInputElement).files);
        let selectedFiles = (e.target as HTMLInputElement).files;
        if (selectedFiles?.length == 0) return;
        let error;
        let formData: FormData = new FormData();
        Object.keys((e.target as HTMLInputElement).files!).forEach((file: string) => {
            if (!selectedFiles![parseInt(file)].type.match(/audio\/*/)) error = true;
            else formData.append("files", selectedFiles![parseInt(file)]);
        });
        if (error) return this._notificationService.showNotification(new CustomNotification("Invalid File Format", true, 2, "The selected file(s) do(es) not have valid format"));

        let tempObservable: Subscription = this._httpService.fileUpload(formData, this.currentPlaylist).subscribe({
            next: (m: ResponseMessage) => this._notificationService.showNotification(new CustomNotification(m.message ?? 'Upload Successful', true, m.code ?? 1, m.body ?? "The selected file(s) uploaded successfully")),
            error: (err: HttpErrorResponse) => this._notificationService.showNotification(new CustomNotification(err.error.message ?? 'Something went wrong', true, 3, err.error.body ?? err.error.error ?? '')),
            complete: () => {
                tempObservable.unsubscribe();
                Object.keys((e.target as HTMLInputElement).files!).forEach((file: string) => {
                    this.allSongsInCurrentPlaylist.push(file);
                });
            }
        });
    }

    public updatePlaylistName(id: string, isCancel?: boolean): void {
        this.isUpdatingPlaylist = true;
        let elem = document.getElementById(id);
        this._playlistToUpdate = id;
        if (isCancel) {
            let e = new Event('change');
            elem!.innerHTML = `<input type='text' value='${id}' autofocus>`;
            elem!.firstChild!.addEventListener("change", (e) => this.updateNamePlaylist.bind(this)(e, isCancel));
            elem!.firstChild!.dispatchEvent(e);
            return;
        }
        elem!.innerHTML = `<input type='text' value='${elem?.innerText}' autofocus>`;
        elem!.firstChild!.addEventListener("change", this.updateNamePlaylist.bind(this));
    }

    public updateNamePlaylist(e: Event, isCancel?: boolean): void {

        let id: string = (e.target as HTMLInputElement).parentElement!.id;
        let elem = document.getElementById(id);
        this.allPlaylists[this.allPlaylists.indexOf(id)] = (e.target as HTMLInputElement).value;

        elem!.id = (e.target as HTMLInputElement).value;
        elem!.innerHTML = `<span>${(e.target as HTMLInputElement).value}</span>`;
        elem!.firstChild!.removeEventListener("change", this.updateNamePlaylist);
        if (!isCancel) {
            let tempObservable: Subscription = this._httpService.updatePlaylistName(this._playlistToUpdate, (e.target as HTMLInputElement).value).subscribe({
                next: (m: ResponseMessage) => this._notificationService.showNotification(new CustomNotification(m.message ?? 'Upload Successful', true, m.code ?? 1, m.body ?? '')),
                error: (err: HttpErrorResponse) => this._notificationService.showNotification(new CustomNotification(err.error.message ?? 'Something went wrong', true, 3, err.error.body ?? err.error.error ?? '')),
                complete: () => {
                    tempObservable.unsubscribe();
                    this.isUpdatingPlaylist = false;
                    this.currentPlaylist = (e.target as HTMLInputElement).value
                }
            });
        }
        else {
            this.isUpdatingPlaylist = false
        }
    }

    public addNewPlaylist(e: Event) {
        let tempObservable: Subscription = this._httpService.createNewPlaylist((e.target as HTMLInputElement).value).subscribe({
            next: (m: ResponseMessage) => this._notificationService.showNotification(new CustomNotification(m.message ?? 'Created Successfully', true, m.code ?? 1, m.body ?? 'The Playlist has been created')),
            error: (err: HttpErrorResponse) => this._notificationService.showNotification(new CustomNotification(err.error.message ?? 'Something went wrong', true, 3, err.error.body ?? err.error.error ?? '')),
            complete: () => {
                tempObservable.unsubscribe();
                this.allPlaylists.push((e.target as HTMLInputElement).value);
                this.isAddigPlaylist = false;
            }
        });
    }

    public playlistSelected(p: string): void {
        this.currentPlaylist = p;
        console.log('load songs for ', p);
        this._getSongsInPlaylist();
    }

    public deletePlaylist(p: string, i: number): void {
        let tempObservable: Subscription = this._httpService.deletePlaylist([p]).subscribe({
            next: (m: ResponseMessage) => this._notificationService.showNotification(new CustomNotification(m.message ?? 'Deleted Successfully', true, m.code ?? 1, m.body ?? '')),
            error: (err: HttpErrorResponse) => this._notificationService.showNotification(new CustomNotification(err.error.message ?? 'Something went wrong', true, 3, err.error.body ?? err.error.error ?? 'The Playlist has been deleted')),
            complete: () => {
                tempObservable.unsubscribe();
                this.allPlaylists.splice(i, 1);
                this.currentPlaylist = this.allPlaylists[0];
            }
        })
    }

    public deleteSong(s: string, i: number) {
        let tempObservable: Subscription = this._httpService.deleteFile(this.currentPlaylist, [s]).subscribe({
            next: (m: ResponseMessage) => this._notificationService.showNotification(new CustomNotification(m.message ?? 'Deleted Successfully', true, m.code ?? 1, m.body ?? '')),
            error: (err: HttpErrorResponse) => this._notificationService.showNotification(new CustomNotification(err.error.message ?? 'Something went wrong', true, 3, err.error.body ?? err.error.error ?? 'The Playlist has been deleted')),
            complete: () => {
                tempObservable.unsubscribe();
                this.allPlaylists.splice(i, 1);
                this.currentPlaylist = this.allPlaylists[0];
            }
        })
    }

    toggleSong(status: boolean) {
        this.toggleSongOutput.emit(status);
    }
}
