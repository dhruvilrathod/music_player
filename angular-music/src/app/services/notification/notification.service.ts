import { Injectable, ViewContainerRef } from '@angular/core';
import { NotificationComponent } from 'src/app/components/notification/notification.component';
import { CustomNotification } from 'src/app/interfaces';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  private _notificationContainer!: ViewContainerRef;
  private _notifications: any = {};

  constructor() { 
    setInterval(() => {
      Object.keys(this._notifications).map((k: any) => {
        if(new Date().getTime() - parseInt(k) > 5000 && this._notifications[k].sticky == false) {
          this._notifications[k].title = undefined
        }
      })
    }, 1000)
  }

  public createNotification(title: string, sticky: boolean, type: number, body?: any): void {
    this.showNotification(new CustomNotification(title, sticky, type, body));
  }


  public showNotification(n: CustomNotification): void {
    this._notifications[n.id as keyof object] = n;
    this._attachNotificationComponent(n);
  }

  public registerContainer(container: ViewContainerRef): void {
    this._notificationContainer = container;
  }

  private _attachNotificationComponent(n: CustomNotification): void {
    const newNotificationRef = this._notificationContainer.createComponent<NotificationComponent>(NotificationComponent);
    newNotificationRef.instance.notification = n;
  }

  public clearNotification(id?: number) {
    if (!id) this.clearAllNotifications();
    id && this._clearNotificationWithID(id);
  }

  public clearAllNotifications(): void {
    this._notificationContainer.clear();
    this._notifications = {};
  }

  private _clearNotificationWithID(id: number) {
    Object.keys(this._notifications).map((k: string, index: number) => {
      if (parseInt(k) == id) {
        this._notificationContainer.remove(index);
        delete this._notifications[k];
      }
    })
  }
}
