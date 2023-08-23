import { Component, Input, OnInit } from '@angular/core';
import Swiper, { SwiperOptions } from 'swiper';
import SwiperCore, {
  Navigation,
  Controller,
  Pagination,
  Thumbs
} from "swiper";
import { Subscription } from 'rxjs';
import { CommonService } from 'src/app/services/common.service';

SwiperCore.use([Controller,Navigation,Pagination,Thumbs ]);

@Component({
  selector: 'app-twitch-grid-slide',
  templateUrl: './twitch-grid-slide.component.html',
  styleUrls: ['./twitch-grid-slide.component.scss']
})
export class TwitchGridSlideComponent implements OnInit {

  @Input() title = '';
  @Input() streamers: Array<any> = [];
  @Input() twitchStreamList: Array<any> = [];
  height: string = ''
  showPagination: boolean = false;
  config: SwiperOptions = {
    slidesPerView: 'auto',
    spaceBetween: 32,
    grabCursor: true,
    breakpoints: {
      410: {
        slidesPerView: 1.1,
      },
      765: {
        initialSlide: 1,
        slidesPerView: 2,
      },
      1023: {
        initialSlide: 0,
        slidesPerView: 'auto',
        centeredSlides: false,
        pagination: {
            clickable: true,
            el: '.swiper-pagination.pagination-scroll',
          },
          navigation: {
            nextEl: '.swiper-button-next-twitch',
            prevEl: '.swiper-button-prev-twitch'
          },
          scrollbar: false,
          watchSlidesProgress: false,
        },
      },
    }

  // thumbsConfig: SwiperOptions = {
  //   slidesPerView: 3,
  //   spaceBetween: 15,
  //   grabCursor: true,
  //   navigation: {
  //     nextEl: '.swiper-button-next-twitch',
  //     prevEl: '.swiper-button-prev-twitch',
  //   },
  // };

  private twitchGridSlideSubscription: Subscription;

  constructor(

    private commonServices: CommonService
  ) {
    this.twitchGridSlideSubscription= this.commonServices.getStreamsDataUpdate().subscribe
    (result => {
      this.twitchStreamList = result.message;
      this.twitchStreamList =
      this.twitchStreamList
        .sort((a: any, b: any) => a.created_at
        - b.created_at
        )
    });
  }

  ngOnInit(): void {
  }

  setHeight() {
    const box = document.getElementById('sliderBox')
    if (box) {
      this.height = String(box.offsetHeight) + 'px'
    }
  }
}
