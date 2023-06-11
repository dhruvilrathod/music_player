import { Component } from '@angular/core';
import { CustomNotification, ResponseMessage } from 'src/app/interfaces';
import { HttpService } from 'src/app/services/http/http.service';
import { NotificationService } from 'src/app/services/notification/notification.service';

@Component({
    selector: 'app-listing',
    templateUrl: './listing.component.html',
    styleUrls: ['./listing.component.scss']
})
export class ListingComponent {

    constructor(
        private _notificationService: NotificationService,
        private _httpService: HttpService
    ) { }

    public filesSelected(e: Event): void {
        console.log((e.target as HTMLInputElement).files);
        let selectedFiles = (e.target as HTMLInputElement).files;
        let error;
        let formData: FormData = new FormData();
        Object.keys((e.target as HTMLInputElement).files!).forEach((file: string) => {
            if (!selectedFiles![parseInt(file)].type.match(/audio\/*/)) error = true;
            else formData.append("files", selectedFiles![parseInt(file)]);
        });
        if (error) this._notificationService.showNotification(new CustomNotification("Invalid File Format", true, 2, "The selected file(s) do(es) not have valid format"));
        let tempObservable = this._httpService.fileUpload(formData, 'My Frontend p').subscribe({
            next: (m:ResponseMessage) => this._notificationService.showNotification(new CustomNotification(m.message ?? 'Upload Successful', true, m.code ?? 1, m.body ?? "The selected file(s) uploaded successfully")),
        });
    }

}
