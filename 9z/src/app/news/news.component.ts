import { Component, OnInit } from '@angular/core';
import SwiperCore, {
  Scrollbar,
  SwiperOptions,
  Autoplay,
  Pagination,
} from 'swiper';
import { CommonService } from '../services/common.service';
import { SanityService } from '../services/sanity.services';
import { SocialService } from '../services/social.service';
import { TranslateService } from '@ngx-translate/core';

SwiperCore.use([Scrollbar, Autoplay, Pagination]);

@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.scss'],
})
export class NewsComponent implements OnInit {
  configHero: SwiperOptions = {
    slidesPerView: 1,
    scrollbar: {
      draggable: true,
    },
    autoplay: {
      delay: 4000,
    },
    watchSlidesProgress: true,
    breakpoints: {
      1024: {
        pagination: {
          type: 'bullets',
          clickable: true,
          el: '.swiper-pagination.pagination-scroll',
        },
        scrollbar: true,
        watchSlidesProgress: false,
      },
    },
  };

  heroSlides: Array<any> = [1, 2, 3, 4];
  upcomingMatchList: Array<any> = [];
  pastMatchList: Array<any> = [];
  bannerNew: any = null;
  featuredNewsList: Array<any> = [];
  heroNewsList: Array<any> = [];
  newsList1: Array<any> = [];
  newsList2: Array<any> = [];
  newsList3: Array<any> = [];
  category1: string = '';
  category2: string = '';
  category3: string = '';
  heroImage: string = '';

  constructor(
    private sanityServices: SanityService,
    private commonServices: CommonService,
    private socialServices: SocialService,
    private translate: TranslateService
  ) {this.translate.setDefaultLang('es');}

  async ngOnInit() {
    const savedLang = localStorage.getItem('lang') || 'es';
    this.translate.use(savedLang); // Esto asegura que tenga el idioma correcto
    await this.getPageNews();
    this.socialServices.updateMetaTags('News');
    const jsonMatches = JSON.parse(localStorage.getItem('matches')!);
    const jsonShownCategories = JSON.parse(
      localStorage.getItem('shownCategories')!
    );
    const jsonNews = JSON.parse(localStorage.getItem('news')!);

    if (
      !jsonMatches ||
      !jsonShownCategories ||
      !jsonNews
    ) {
      await this.sanityServices.getShownCategories();
      await this.sanityServices.getTeamMembers();
      await this.sanityServices.getNews();
      await this.sanityServices.getMatches();

      setTimeout(async () => {
        const jsonMatches = JSON.parse(
          localStorage.getItem('matches')!
        );
        const jsonShownCategories = JSON.parse(
          localStorage.getItem('shownCategories')!
        );
        const jsonNews = JSON.parse(localStorage.getItem('news')!);

        this.getShownCategories(jsonShownCategories);
        this.getNewsList(jsonNews);
        this.getMatchesLists(jsonMatches);
      }, 1000);
    } else {
      this.getShownCategories(jsonShownCategories);
      this.getNewsList(jsonNews);
      this.getMatchesLists(jsonMatches);
    }
  }

  async getPageNews() {
    const response: any = await this.sanityServices.getPageNews()
    .catch(error => {
      console.log(error);
    });

    if (response) {
      this.heroImage = response.imageHero;
      this.heroNewsList = response.heroNews;
      this.bannerNew = response.bannerNew;
      this.featuredNewsList = response.featuredNews;
      console.log(response)
      this.heroNewsList.forEach((post: any) => {
        post.newTitle = post.title.split(' ').join('-');
        post.slug = this.getName(post.title)
      })
      this.featuredNewsList.forEach((post: any) => post.slug = this.getName(post.title));
      this.bannerNew.slug = this.getName(this.bannerNew.title);

    }
  }



  getMatchesLists(jsonMatches: any) {
    jsonMatches.result.forEach((match: any) => {
      if (match.game.name.toLowerCase() === 'fortnite') {
        if (!match.position && !match.teamMember) {
          this.upcomingMatchList.push(match)
        } else {
          this.pastMatchList.push(match)
        }
      } else if (match.result1 === '0' && match.result2 === '0'){
        this.upcomingMatchList.push(match)
      } else {
        this.pastMatchList.push(match)
      }
    })

    const data = {
      upcomingMatchList: this.upcomingMatchList,
      pastMatchList: this.pastMatchList,
      matchesToShow: 3,
    };
    this.commonServices.sendInfoMatchesUpdate(data);
  }

  getNewsList(jsonNews: any) {
    this.newsList1 = [];
    this.newsList2 = [];
    this.newsList3 = [];

    jsonNews.result.forEach((post: any) => {
      post.newTitle = post.title.split(' ').join('-');

      if (post.category) {
        if (post.category === this.category1) {
          this.newsList1.push(post)
        }
         if (post.category === this.category2) {
          this.newsList2.push(post)
        }
         if (post.category === this.category3) {
          this.newsList3.push(post)
        }
      }
    })
  }

  getShownCategories(jsonShownCategories: any) {
    this.category1 = jsonShownCategories.result[0].category1;
    this.category2 = jsonShownCategories.result[0].category2;
    this.category3 = jsonShownCategories.result[0].category3;
  }

  getName(name: string) {
    name = name.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    // name = name.replace(/&nbsp;|\u00a0/gi,"")
    return name.toLowerCase()
    .trim()
    .replace(/[^a-z0-9-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .replace('"', '')
    .replace(':', '-' );
  }
}
