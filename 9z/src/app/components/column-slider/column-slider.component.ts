import { Component, Input, OnInit } from '@angular/core';
import SwiperCore, {
  SwiperOptions,
  Grid
} from "swiper";

@Component({
  selector: 'app-column-slider',
  templateUrl: './column-slider.component.html',
  styleUrls: ['./column-slider.component.scss']
})
export class ColumnSliderComponent implements OnInit {

  @Input() title = '';
  @Input() player: boolean = false;
  @Input() newsList: Array<any> = [];
  @Input() allNews = false;
  config: SwiperOptions = {
    slidesPerView: 1.2,
    spaceBetween: 30,
    grabCursor: true,
    breakpoints: {
      765: {
        slidesPerView: 2,
      },
      1024: {
        slidesPerView: 3,
      },
    }
  };

  constructor() { }

  ngOnInit(): void {
    if (this.allNews) {
      this.config = {
        slidesPerView: 1.5,
        spaceBetween: 20,

        breakpoints: {
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
}
