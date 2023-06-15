import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { PlayerComponent } from './components/player/player.component';
import { ListingComponent } from './components/listing/listing.component';
import { NotificationComponent } from './components/notification/notification.component';
import { ErrorComponent } from './components/error/error.component';
import { HttpClientInterceptor } from './interceptors/http/http-client.interceptor';
import { environment } from 'src/environments/environment.development';
import { NotificationContainerComponent } from './components/notification-container/notification-container.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    PlayerComponent,
    ListingComponent,
    NotificationComponent,
    ErrorComponent,
    NotificationContainerComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpClientInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
