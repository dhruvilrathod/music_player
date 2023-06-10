import { AfterViewInit, Component, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { HttpService } from './services/http/http.service';
import { Subscription } from 'rxjs';
import { NotificationService } from './services/notification/notification.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, AfterViewInit {
  title = 'Music Player';

  @ViewChild('notificationContainer', { read: ViewContainerRef }) notificationContainer!: ViewContainerRef;

  public temp1: any;

  constructor(
    private _http: HttpService,
    private _notificationService: NotificationService
  ) { }

  ngOnInit(): void {
    // this.tempApiCall();
  }


  tempApiCall() {
    var tempObservable: Subscription = this._http.getStatus().subscribe({
      next: (data: any) => {
        this.temp1 = data.status1;
        this._notificationService.createNotification(data.status1, true, 3, "This is message from server")
      },
      complete: () => tempObservable.unsubscribe()
    })
  }

  ngAfterViewInit(): void {
    this._notificationService.registerContainer(this.notificationContainer);
  }
}
