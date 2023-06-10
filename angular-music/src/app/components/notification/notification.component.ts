import { trigger, transition, style, animate } from '@angular/animations';
import { Component, DoCheck, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { CustomNotification } from 'src/app/interfaces';
import { NotificationService } from 'src/app/services/notification/notification.service';
import { fadeAnimations } from 'src/assets/animations';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss'],
  // animations: [fadeAnimations]
  animations: [
    trigger(
      'enterAnimation', [
      transition(':enter', [
        style({ transform: 'translateY(10%)', opacity: 0 }),
        animate('200ms', style({ transform: 'translateX(0)', opacity: 1 }))
      ]),
      transition(':leave', [
        style({ transform: 'translateX(0)', opacity: 1 }),
        animate('200ms', style({ transform: 'translateY(10%)', opacity: 0 }))
      ])
    ]
    )
  ],
})
export class NotificationComponent implements OnInit{

  @Input() notification!: CustomNotification;

  constructor(
    private _notificationService: NotificationService
  ) {}


  ngOnInit(): void { 
  }

  public closeNotification() {
    let id = this.notification!.id;
    (this.notification as any) = undefined;
    setTimeout(() => {
      this._notificationService.clearNotification(id);
    }, 200);
  }

}
