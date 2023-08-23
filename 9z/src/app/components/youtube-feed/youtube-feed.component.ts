import { Component, Input, OnInit } from '@angular/core';
import { SwiperOptions } from 'swiper';


@Component({
  selector: 'app-youtube-feed',
  templateUrl: './youtube-feed.component.html',
  styleUrls: ['./youtube-feed.component.scss']
})
export class YoutubeFeedComponent implements OnInit {
  @Input() title = '';

  @Input() videosList: Array<any> = [];
  @Input() standalone: boolean = false;
  @Input() allVideos = false;
  height: string = ''
  config: SwiperOptions = {
    slidesPerView: 1.3,
    spaceBetween: 20,
    grabCursor: true,
    loop: false,
    initialSlide:0,
    breakpoints: {
      // when window width is >= 320px
      765: {
        slidesPerView: 2,
      },
      1024: {
        slidesPerView: 3,
        spaceBetween: 20,
        navigation: {
          nextEl: '.swiper-button-next-twitch',
          prevEl: '.swiper-button-prev-twitch',
        },

      },
    }
  };
  constructor() { }

  ngOnInit(): void {
    if (this.allVideos) {
      this.config = {
        slidesPerView: 1.5,
        spaceBetween: 20,
        breakpoints: {
        // when window width is >= 320px
          765: {
            enabled: false,
            slidesPerView: 2.1,
            grid: {
              rows: 2,
            },
          },
          1024: {
            enabled: false,
            slidesPerView: 3.1,
            grid: {
              rows: 3,
            },
          },
        }
      }
    }
  }

  setHeight() {
    const videoHeight = document.getElementById('videoImage');
    if (videoHeight) {
     this.height = String(videoHeight.offsetHeight === 0 ? videoHeight.clientHeight : videoHeight.offsetHeight) + 'px';
    }
  }
}
