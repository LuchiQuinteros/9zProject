import { Component, OnInit } from '@angular/core';
import { SocialService } from 'src/app/services/social.service';
import SwiperCore, { SwiperOptions } from 'swiper';

@Component({
  selector: 'app-twitter-feed',
  templateUrl: './twitter-feed.component.html',
  styleUrls: ['./twitter-feed.component.scss'],
})
export class TwitterFeedComponent implements OnInit {
  tweetList: Array<any> = [];

  configTwitter: SwiperOptions = {
    slidesPerView: 1.3,
    spaceBetween: 15,
    autoplay: {
      delay: 5000,
      disableOnInteraction: true,
    },
    watchSlidesProgress: true,
    grabCursor: true,
    breakpoints: {
      765: {
        slidesPerView: 2.4,
      },
      1024: {
        slidesPerView: 4,
        slidesPerGroup: 4,
        pagination: {
          clickable: true,
          el: '.swiper-pagination.pagination-scroll',
        },
        navigation: {
          nextEl: '.swiper-button-next-twitter',
          prevEl: '.swiper-button-prev-twitter',
        },
      },
    },
  };

  constructor(private socialServices: SocialService) {}

  async ngOnInit() {
    
  }

  async getTweets() {
    const tweets = await this.socialServices.getTweets().catch((err) => {
      console.log('Se ha producido un error al intentar obtener los tweets.');
    });

    if (tweets?.data) {
      if (tweets.includes && tweets.includes.users) {
        let list: any[] = [];
        tweets.data.forEach((pretweet: any) => {
          const tweet = {
            name: tweets.includes.users[0].name,
            picture: tweets.includes.users[0].profile_image_url,
            text: pretweet.text,
            timestamp: new Date(pretweet.created_at),
            created : ''
          };

          let startDate = new Date();
          let tweetTime: any;
          tweetTime = ((tweet.timestamp.getTime() - startDate.getTime()) / 1000 /60 /60.) * -1;
            if (tweetTime < 1) {
              let tweetTimeFirst = tweetTime.toFixed(2);
              tweetTime = 60 * ((tweetTimeFirst * 100) / 100);
              tweetTime = 'hace ' + tweetTime + ' minutos'
            }
         if (tweetTime <= 24 && tweetTime > 1) {
              if (tweetTime >= 1 && tweetTime < 2) {
                tweetTime = 'hace ' + tweetTime.toFixed(0) + ' hora'
              } else {
                tweetTime = 'hace ' + tweetTime.toFixed(0) + ' horas'
              }
            }
            else if (tweetTime > 24) {
              tweetTime = tweetTime.toFixed(0) / 24;
              if (tweetTime.toFixed(0) >= 1 && tweetTime.toFixed(0) < 2) {
                tweetTime = 'hace ' + tweetTime.toFixed(0) + ' día';
              } else {
                tweetTime = 'hace ' + tweetTime.toFixed(0) + ' días'
              }
            }
          tweet.created = tweetTime;
          if (!list.includes(tweet)) {
            list.push(tweet)
          }
         });

        list.sort((a: any, b: any) => a.timestamp - b.timestamp).reverse();
        this.tweetList = list;
      }
    }
  }
}
