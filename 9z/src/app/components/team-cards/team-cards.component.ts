  import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
  import SwiperCore, {
    SwiperOptions,
  } from "swiper";

  @Component({
    selector: 'app-team-cards',
    templateUrl: './team-cards.component.html',
    styleUrls: ['./team-cards.component.scss']
  })
  export class TeamCardsComponent implements OnInit {

  @Input() slides: Array<any> = [];
  @Input() title: string = '';
  @Input() player: any = null;
  players:  Array<any> = [];
  ready: any = false;
    config: SwiperOptions = {
    slidesPerView: 1,
    centeredSlides: true,
    spaceBetween: 15,
    breakpoints: {
      410: {
        slidesPerView: 1.25,
        centeredSlides: true,
      },
      765: {
        centeredSlides: true,
        initialSlide: 1,
        slidesPerView: 2,
      },
      1024: {
        centeredSlides: true,
        slidesPerView: 3,
        grabCursor: true,
        navigation: {
          nextEl: '.swiper-button-next-team',
          prevEl: '.swiper-button-prev-team',
          },
        },
      }
    };

    constructor(private route: ActivatedRoute) { }

  async ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      this.checkPlayers(params);
    });
  }

  checkPlayers(data: any) {
    this.players = data?.params?.name ? this.slides.filter((player) => player.slug !== data.params.name) : this.slides
    this.ready = true;
  }

}
