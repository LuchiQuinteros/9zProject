import { Component, Input, OnInit } from '@angular/core';
import SwiperCore, {
  SwiperOptions,
  Grid
} from "swiper";
import { TranslateService } from '@ngx-translate/core';

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

  constructor(private translate: TranslateService) {
    this.translate.setDefaultLang('es');
  }

  ngOnInit(): void {
    const savedLang = localStorage.getItem('lang') || 'es';
    this.translate.use(savedLang); // Esto asegura que tenga el idioma correcto
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
