import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { CommonService } from 'src/app/services/common.service';
import { SwiperOptions } from 'swiper';

@Component({
  selector: 'app-club',
  templateUrl: './club.component.html',
  styleUrls: ['./club.component.scss'],
})
export class ClubComponent implements OnInit {
  private clubSubscription: Subscription;
  

  @Input() popularNews: Array<any> = [];
  mostPopularNew: any = null;
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

  constructor(private commonServices: CommonService, private router: Router) {
    this.clubSubscription = this.commonServices
      .getfeaturedNewsListClubUpdate()
      .subscribe((result) => {
        this.popularNews = result.message;
      });
  }

  redirectToNoticia(slug: String) {
    // Redirige a la URL deseada al hacer clic en la tarjeta
    this.router.navigate(['../noticia/' + slug]);
  }

  ngOnInit(): void {
    if (this.popularNews.length > 0) {
      this.mostPopularNew = this.popularNews.reverse()[0];
    }

  }

}
