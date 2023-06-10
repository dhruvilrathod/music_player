import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.scss']
})
export class PlayerComponent implements AfterViewInit {

  @ViewChild('audio') audioTag!: ElementRef;

  public isPlaying: boolean = false;
  public player!: HTMLAudioElement;
  public currentTime!: number;
  public duration!: number;
  public sliderValue!: number;

  ngAfterViewInit(): void {
    window.addEventListener("keydown", (e) => {
      if(e.code == "Space") {
        this.isPlaying = !this.isPlaying;
        this.toggleAudio(this.isPlaying);
      }
    })
  }

  public playerRegister(e: Event) {
    this.player = this.audioTag.nativeElement as HTMLAudioElement;
    setInterval(() => {
      this.currentTime = this.player.currentTime * 1000 - 1800000;
      this.sliderValue = Math.floor(this.player.currentTime/this.player.duration * 1000);
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

}
