import { Component, OnInit } from '@angular/core';
import { SwiperOptions } from 'swiper';
import { SocialService } from '../services/social.service';
import { SanityService } from '../services/sanity.services';
import { TranslateService } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';

export interface Sponsor {
  logo: string;
  name: string;
}

interface Social {
  name: string,
  icon: string,
  followers: string,
}


@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})

export class AboutComponent implements OnInit {
  aboutImages = [
    '../../assets/about/Promesa.jpg',
    '../../assets/about/Misión.jpg',
    '../../assets/about/Valores.jpg'
  ]
  sponsors: Sponsor[] = [];
  social: Social[] = [
    {
      name: "twitter",
      icon: "../../assets/svg/social/Twitter.svg",
      followers: ""
    },
    {
      name: "instagram",
      icon: "../../assets/svg/social/Instagram.svg",
      followers: ""
    },
    {
      name: 'youtube',
      icon: "../../assets/svg/social/Youtube.svg",
      followers: ""
    },
    {
      name: "linkedin",
      icon: "../../assets/svg/social/linkedin.svg",
      followers: ""
    },
    {
      name: "discord",
      icon: "../../assets/svg/social/Discord.svg",
      followers: ""
    },
    {
      name: "twitch",
      icon: "../../assets/svg/social/Twitch.svg",
      followers: ""
    },
    {
      name: "tiktok",
      icon: "../../assets/svg/social/Tiktok.svg",
      followers: "1.2M+"
    }
  ]

  aboutSlide: SwiperOptions = {
    slidesPerView: 1.4,
    spaceBetween: 20,
    grabCursor: true,
    initialSlide: 1,
    centeredSlides: true,

    breakpoints: {

      765: {
        slidesPerView: 2,
      },

      1024: {
        slidesPerView: 3,
        centeredSlides: true,
        spaceBetween: 50,
        initialSlide: 1,
        navigation: {
          nextEl: '.swiper-button-next-about',
          prevEl: '.swiper-button-prev-about',
        },
      }
    }
  }
  
  constructor(
    private translate: TranslateService,
    private http: HttpClient,
    private socialServices: SocialService,
    private sanityServices: SanityService
  ) {
    this.translate.setDefaultLang('es');
  }
  
  setLanguage(lang: string) {
    this.translate.use(lang);
    localStorage.setItem('lang', lang);
  }

  async ngOnInit() {
    await this.getSocialNetworkData();
    await this.getSponsors();
    this.socialServices.updateMetaTags('About');
  }

  async getSocialNetworkData() {
    let response: any = await this.sanityServices.getSocialNetwork()
    .catch(error => {
      console.log(error);
    });

    if (response) {
      for (let key in response) {
        this.social.forEach((social: any) => {
          if (key === social.name) {
            social.followers = response[key] + '+'
          }
        })
      }

    }
  }

  async getSponsors() {
    const response: any = await this.sanityServices.getSponsorsByPage('Nosotros')
    .catch(error => {
      console.log(error);
    });

    if (response?.logos) {
      this.sponsors = response.logos;
    }
  }

}
