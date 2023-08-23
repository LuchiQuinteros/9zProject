import { Component, Input, OnInit } from '@angular/core';
import SwiperCore, {
  SwiperOptions,
} from "swiper";

@Component({
  selector: 'app-grid-slides',
  templateUrl: './grid-slides.component.html',
  styleUrls: ['./grid-slides.component.scss']
})
export class GridSlidesComponent implements OnInit {

  @Input() slides: Array<any> = [];
  @Input() title: string = '';
  layout: string = 'flex'
  gridSlide: SwiperOptions = {
    slidesPerView: 1.2,
    spaceBetween: 15,
    breakpoints: {
      // when window width is >= 320px
      765: {
        slidesPerView: 2,
      },
      1024: {
        slidesPerView: 'auto',
        spaceBetween: 0,
      },
    }
  };

  constructor() { }

  ngOnInit(): void {}

}
