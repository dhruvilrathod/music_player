import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  public currentTab: number = 1;

  ngOnInit(): void {
    this.tabChange(2);
  }

  public tabChange(tabIndex: number): void {
    if (this.currentTab == tabIndex) return;
    let scrollWidth = document.getElementById('player')?.parentElement?.offsetWidth;
    switch (tabIndex) {
      case 1:
        console.log("switch to tab 1");
        document.getElementById('listing')!.style.transform = `translateX(0px)`;
        document.getElementById('player')!.style.transform = `translateX(0px)`;       
        this.currentTab = 1;
        break;
      case 2:
        console.log("switch to tab 2");
        document.getElementById('listing')!.style.transform = `translateX(-${scrollWidth}px)`;
        document.getElementById('player')!.style.transform = `translateX(-${scrollWidth}px)`;       
        this.currentTab = 2;
        break;
      default:
        break;
    }
  }
}
