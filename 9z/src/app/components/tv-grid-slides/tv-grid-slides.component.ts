import { Component, OnInit } from '@angular/core';
import SwiperCore, {
  SwiperOptions,
} from "swiper";

@Component({
  selector: 'app-tv-grid-slides',
  templateUrl: './tv-grid-slides.component.html',
  styleUrls: ['./tv-grid-slides.component.scss']
})
export class TvGridSlidesComponent implements OnInit {

  slides: Array<any> = [1,2,3];

  config: SwiperOptions = {
    slidesPerView: 1,
    spaceBetween: 15,
    breakpoints: {
      // when window width is >= 320px
      765: {
        slidesPerView: 2.5,
        spaceBetween: 24,
      },
      1024: {
        slidesPerView: 3,
        spaceBetween: 24,
        enabled: false,
      },
    }
  };


  constructor() { }

  ngOnInit(): void {
  }

}
