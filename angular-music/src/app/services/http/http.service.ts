import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Endpoints, QueryParams } from 'src/app/enums';
import { MusicHistory, ResponseMessage } from 'src/app/interfaces';

@Injectable({
    providedIn: 'root'
})
export class HttpService {

    constructor(
        private _http: HttpClient
    ) { }

    public getStatus(): Observable<string> {
        return this._http.get<string>(Endpoints.FILE_SERVER_STATUS);
    }

    public getAllPlaylists(): Observable<string[]> {
        return this._http.get<string[]>(Endpoints.GET_ALL_PLAYLISTS);
    }

    public getMusicsOfPlaylist(playlist: string): Observable<string[]> {
        return this._http.get<string[]>(`${Endpoints.GET_MUSICS_OF_PLAYLIST}?${QueryParams.PLAYLIST_NAME}=${playlist}`);
    }

    public getMusicFile(playlist: string, musicFile: string): Observable<File> {
        return this._http.get<File>(`${Endpoints.GET_MUSIC_FILE}?${QueryParams.PLAYLIST_NAME}=${playlist}&${QueryParams.FILE_NAME}=${musicFile}`);
    }

    public createNewPlaylist(playlist: string): Observable<ResponseMessage> {
        return this._http.post<ResponseMessage>(`${Endpoints.CREATE_NEW_PLAYLIST}?${QueryParams.PLAYLIST_NAME}=${playlist}`, '');
    }

    public deletePlaylist(playlists: string[]): Observable<ResponseMessage> {
        return this._http.delete<ResponseMessage>(`${Endpoints.DELETE_PLAYLIST}`, { body: {playlists: playlists} });
    }

    public deleteFile(playlist: string, fileNames: string[]) {
        return this._http.delete(`${Endpoints.CREATE_NEW_PLAYLIST}?${QueryParams.PLAYLIST_NAME}=${playlist}`, { body: {files: fileNames} });
    }

    public fileUpload(files:FormData, playlist: string): Observable<ResponseMessage> {
        return this._http.post<ResponseMessage>(`${Endpoints.UPLOAD_FILE_TO_PLAYLIST}?${QueryParams.PLAYLIST_NAME}=${playlist}`, files)
    }

    public updatePlaylistName(currentName: string, updatedName: string): Observable<ResponseMessage> { 
        return this._http.post<ResponseMessage>(`${Endpoints.UPDATE_PLAYLIST_NAME}?${QueryParams.PLAYLIST_NAME}=${currentName}&${QueryParams.UPDATED_PLAYLIST_NAME}=${updatedName}`, {});
    }

    public updateMusicName(currentPlaylist:string, currentName: string, updatedName: string): Observable<ResponseMessage> {
        return this._http.post<ResponseMessage>(`${Endpoints.UPDATE_MUSIC_NAME}?${QueryParams.PLAYLIST_NAME}=${currentPlaylist}&${QueryParams.FILE_NAME}=${currentName}&${QueryParams.UPDATED_FILE_NAME}=${updatedName}`, {});
    }

    public getPlayerHistory(): Observable<MusicHistory> {
        return this._http.get<MusicHistory>(Endpoints.GET_PLAYER_HISTORY);
    }
}
