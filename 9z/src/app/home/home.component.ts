import { Component, OnInit } from '@angular/core';
import SwiperCore, { Scrollbar, SwiperOptions, EffectFade } from 'swiper';
import { SanityService } from '../services/sanity.services';
import { SocialService } from '../services/social.service';
import { CommonService } from '../services/common.service';
import { Link } from '../footer/footer.component';
import { Router } from '@angular/router';
SwiperCore.use([Scrollbar, EffectFade]);
declare var particlesJS: any;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  configHero: SwiperOptions = {
    slidesPerView: 1,
    effect: 'fade',
    fadeEffect: {
      crossFade: true,
    },
    scrollbar: {
      draggable: true,
    },
    autoplay: {
      delay: 5000,
    },
    watchSlidesProgress: true,
    loop: true,
  };

  title: string = '';

  buttonCta: any = {
    title: '',
    localRedirect: null,
    redirect: '',
  };

  sponsors: any[] = [];
  category1: string = '';
  category2: string = '';
  category3: string = '';
  heroImage: string = '';
  heroSlides: Array<{ image: string; url: string; title: string }> = [];

  heroSlide: string = '';
  tweetList: Array<any> = [];
  twitchStreamList: Array<any> = [];
  streamersList: Array<any> = [];
  upcomingMatchList: Array<any> = [];
  pastMatchList: Array<any> = [];
  featuredNewsList: Array<any> = [];
  youtubeVideosList: Array<any> = [];
  videosIds: Array<any> = [];
  videoGalleries: any[] = [];
  style = {};
  teams: Link[] = [
    {
      name: 'cs main',
      image: '../../assets/teams/mb-cs-main.jpg',
      url: '/equipo/csgo-main',
    },
    {
      name: 'cs academy',
      image: '../../assets/teams/mb-cs-ac.jpg',
      url: '/equipo/csgo-academy',
    },

    {
      name: 'sim racing',
      image: '../../assets/teams/mb-sim-racing.jpg',
      url: '/equipo/sim-racing',
    },

    {
      name: 'valorant',
      image: '../../assets/teams/mb-valorant.jpg',
      url: '/equipo/valorant',
    },
    {
      name: 'valorant femenino',
      image: '../../assets/teams/mb-valorant-fem.jpg',
      url: '/equipo/valorant-fem',
    },
  ];
  constructor(
    private socialServices: SocialService,
    private sanityServices: SanityService,
    private commonServices: CommonService,
    private router: Router
  ) {}

  async ngOnInit() {
    await this.getHomeData();
    await this.getSponsors();
    await this.getPageNews();
    await this.getVideoGalleries();

    this.socialServices.updateMetaTags('Home');

    let json = JSON.parse(localStorage.getItem('matches')!);

    if (!json) {
      await this.sanityServices.getTeams();
      await this.sanityServices.getTeamMembers();
      await this.sanityServices.getMatches();
      await this.sanityServices.getShownCategories();
      setTimeout(async () => {
        console.log(json);
        this.getMatches(json);
        const data = {
          upcomingMatchList: this.upcomingMatchList,
          pastMatchList: this.pastMatchList,
          matchesToShow: 2,
        };

        const jsonShownCategories = JSON.parse(
          localStorage.getItem('shownCategories')!
        );

        this.commonServices.sendInfoMatchesUpdate(data);
        this.getShownCategories(jsonShownCategories);
      }, 850);
    } else {
      console.log(json);
      this.getMatches(json);
    }

    let result = JSON.parse(localStorage.getItem('streamers')!);
    if (result === 'null' || result === null) {
      setTimeout(async () => {
        this.streamersList = JSON.parse(
          localStorage.getItem('streamers') || '[]'
        );
        this.twitchStreamList = [];
        await this.getStreams(this.streamersList);
        this.streamersList.forEach(async (streamer: any) => {
          await this.getStreamsByUserId(streamer.user_id);
        });
        // for (let i = 0; i < this.streamersList.length; i++) {
        //   await this.getStreamsByUserId(this.streamersList[i].user_id);
        // }
        this.commonServices.sendStreamsDataUpdate(this.twitchStreamList);
      }, 1500);
    } else {
      this.streamersList = result;
      this.twitchStreamList = [];
      await this.getStreams(this.streamersList);

      this.streamersList.forEach(async (streamer: any) => {
        await this.getStreamsByUserId(streamer.user_id);
      });
      this.commonServices.sendStreamsDataUpdate(this.twitchStreamList);
    }
  }

  getShownCategories(jsonShownCategories: any) {
    this.category1 = jsonShownCategories.result[0].category1;
    this.category2 = jsonShownCategories.result[0].category2;
    this.category3 = jsonShownCategories.result[0].category3;
  }

  async getMatches(matches: any) {
    matches.result.forEach((match: any) => {
      if (match.game.name.toLowerCase() === 'fortnite') {
        if (!match.position && !match.teamMember) {
          this.upcomingMatchList.push(match);
        } else {
          this.pastMatchList.push(match);
        }
      } else if (match.result1 === '0' && match.result2 === '0') {
        this.upcomingMatchList.push(match);
      } else {
        this.pastMatchList.push(match);
      }
    });
    // for (let i = 0; i < matches.result.length; i++) {
    //   if (matches.result[i].game.name.toLocaleLowerCase() === 'fortnite') {
    //     if (
    //       matches.result[i].position === null &&
    //       matches.result[i].teamMember === null
    //     ) {
    //       this.upcomingMatchList.push(matches.result[i]);
    //     } else {
    //       this.pastMatchList.push(matches.result[i]);
    //     }
    //   } else {
    //     if (
    //       matches.result[i].result1 === '0' &&
    //       matches.result[i].result2 === '0'
    //     ) {
    //       this.upcomingMatchList.push(matches.result[i]);
    //     } else {
    //       this.pastMatchList.push(matches.result[i]);
    //     }
    //   }
    // }
  }

  scrollIntoView(id: string, id2: string) {
    let element = document.getElementById(id);

    if (element === null) {
      element = document.getElementById(id2);
    }

    element?.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
    });
  }

  buttonHover(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    const rect = target.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    this.style = {
      '--x': `${x}px`,
      '--y': `${y}px`,
    };
  }

  async getSponsors() {
    const response: any = await this.sanityServices
      .getSponsorsByPage('Inicio')
      .catch((error) => {
        console.log(error);
      });

    if (response?.logos) {
      this.sponsors = response.logos;
    }
  }

  async getHomeData() {
    const response: any = await this.sanityServices.getHome().catch((error) => {
      console.log(error);
    });

    if (response) {
      this.title = response.title;
      this.buttonCta.title = response.titleCTA;
      this.buttonCta.localRedirect = response.localRedirect;
      this.buttonCta.redirect = response.urlCTA;
      this.heroSlide =
        window.innerWidth < 767 ? response.imageHeroMob : response.imageHero;

      this.heroSlides = [
        {
          image: '/assets/home/1.jpg',
          url: 'https://shop.9z.gg/shop/category/9z-pro-448',
          title: '9z Pro',
        },
        {
          image: '/assets/home/2.jpg',
          url: 'https://shop.9z.gg/shop/wgm2308-p-mouse-9z-spectre-violeta-262868?category=448#attr=',
          title: '9z Spectre',
        },
        {
          image: '/assets/home/3.jpg',
          url: 'https://shop.9z.gg/shop/wlktkl2405-teclado-inalambrico-9z-ghoul-blanco-262866?category=448#attr=',
          title: '9z Ghoul',
        },
        {
          image: '/assets/home/4.jpg',
          url: 'https://shop.9z.gg/shop/mp-cu-45404-mousepad-9z-phantom-chico-262872?category=448#attr=',
          title: '9z Phantom Chico',
        },
        {
          image: '/assets/home/5.jpg',
          url: 'https://shop.9z.gg/shop/mp-cu-90434-mousepad-9z-phantom-grande-262873?category=448#attr=',
          title: '9z Phantom Grande',
        },
      ];
    }
  }

  async getPageNews() {
    const response: any = await this.sanityServices
      .getPageNews()
      .catch((error) => {
        console.log(error);
      });

    if (response) {
      this.featuredNewsList = response.featuredNews;
      this.commonServices.sendfeaturedNewsListClubUpdate(this.featuredNewsList);
    }
    this.featuredNewsList.forEach(
      (post: any) => (post.slug = this.getName(post.title))
    );
  }

  async getVideoGalleries() {
    const response: any = await this.sanityServices
      .getVideoGalleries()
      .catch((error) => {
        console.log(error);
      });

    if (response) {
      this.videoGalleries = response;
    }
  }

  ctaRedirect(url: string) {
    if (url) {
      this.router.navigate([url]);
    }
  }

  async getTwitchUserId(list: Array<any>) {
    const response: any = await this.socialServices
      .getTwitchUserId(list)
      .catch(async (err) => {
        console.log(
          'Se ha producido un error al intentar obtener los User_id de twitch.'
        );
        if (err !== undefined) {
          console.log(err);
          if (
            err.error.error === 'Unauthorized' &&
            err.error.message === 'Invalid OAuth token'
          ) {
            await this.refreshTwitchToken();
          }
        }
      });
    if (response !== null && response !== undefined) {
      const userId = response.data[0].id;
      await this.getStreamsByUserId(userId);
    }
  }

  async getStreams(streamersList: Array<any>) {
    const twitchStreams = await this.socialServices
      .getStreams(streamersList)
      .catch(async (err) => {
        console.log(
          'Se ha producido un error al intentar obtener los streams.'
        );
        if (err !== undefined) {
          console.log(err);
          if (
            err.error.error === 'Unauthorized' &&
            err.error.message === 'Invalid OAuth token'
          ) {
            await this.refreshTwitchToken();
          }
        }
      });
    if (twitchStreams) {
      twitchStreams.data.forEach((stream: any) => {
        (stream.thumbnail_url = stream.thumbnail_url.replace(
          '{width}',
          '1280'
        )),
          (stream.thumbnail_url = stream.thumbnail_url.replace(
            '{height}',
            '720'
          ));
        streamersList.forEach((streamer: any) => {
          if (stream.user_id === streamer.user_id) {
            stream.user_image = streamer.user_image;
          }
        });
      });
      this.twitchStreamList = twitchStreams.data;
    }
  }

  async getStreamsByUserId(userId: string) {
    const twitchStreams = await this.socialServices
      .getStreamsByUserId(userId)
      .catch(async (err) => {
        console.log(
          'Se ha producido un error al intentar obtener los streams.'
        );
        if (err !== undefined) {
          console.log(err);
          if (
            err.error.error === 'Unauthorized' &&
            err.error.message === 'Invalid OAuth token'
          ) {
            await this.refreshTwitchToken();
          }
        }
      });
    if (twitchStreams) {
      twitchStreams.data.forEach((stream: any) => {
        (stream.thumbnail_url = stream.thumbnail_url.replace(
          '%{width}',
          '1280'
        )),
          (stream.thumbnail_url = stream.thumbnail_url.replace(
            '%{height}',
            '720'
          ));
        this.streamersList.forEach((streamer: any) => {
          if (stream.user_id === streamer.user_id) {
            stream.user_image = streamer.user_image;
          }
        });
      });
      this.twitchStreamList = this.twitchStreamList.concat(twitchStreams.data);
    }
  }

  async refreshTwitchToken() {
    const response: any = await this.socialServices
      .refreshTwitchToken()
      .catch((err) => {
        console.log(err);
      });

    if (response !== undefined) {
      console.log('Se refresheó twitch access token');
    }
  }

  getName(name: string) {
    name = name.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    // name = name.replace(/&nbsp;|\u00a0/gi,"")
    return name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9-]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '')
      .replace('"', '')
      .replace(':', '-');
  }
}
