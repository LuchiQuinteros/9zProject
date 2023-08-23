import { Component, Input, OnInit } from '@angular/core';
import SwiperCore, {
  SwiperOptions,
} from "swiper";

@Component({
  selector: 'app-gaming',
  templateUrl: './gaming.component.html',
  styleUrls: ['./gaming.component.scss']
})
export class GamingComponent implements OnInit {

  @Input() title: string = '';
  @Input() newsList: Array<any> = [];
  index: number = 0;

  config: SwiperOptions = {
    slidesPerView: 1.20,
    spaceBetween: 15,
    breakpoints: {
       765: {
        slidesPerView: 2,
      },
      1024: {
        enabled: false,
      },
    }
  };


  constructor() { }

  ngOnInit(): void {
    this.index = this.newsList.length;
    console.log(this.newsList)
  }
}
