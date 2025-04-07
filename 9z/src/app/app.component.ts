import { Component, OnInit } from '@angular/core';
import { delayAnimation, fadeAnimation, fadeOut } from './animations';
import { SocialService } from './services/social.service';;
import streamers from '../assets/streamers/streamersList.json';
import { SanityService } from './services/sanity.services';
import Scrollbar from 'smooth-scrollbar';
import { ScrollbarCustomPlugin } from './components/scrollbar-plugin';
import { NavigationEnd, NavigationStart, Router } from '@angular/router';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [
    delayAnimation,
    fadeOut,
    fadeAnimation,
  ]
})

export class AppComponent {
  activeMenu: boolean = false;
  loading: boolean = true;
  posts: any;
  streamersList: Array<any> = [];
  lastScroll = 0;
  scrollbar: any;
  constructor(
    private sanityServices: SanityService,
    private socialServices: SocialService,
    private router: Router,
  ) {
    router.events.subscribe(async (val) => {
      if (val instanceof NavigationStart) {
        this.onActivate(val)
        setTimeout(() => {
          this.scrollbar.scrollTo(0, 0, 600)
         }, 500);
      }
    })
  }

  async ngOnInit() {
    const style = 'background-color: #1C1C1C; color: #FFAAAA; padding: 4px 8px; font-size: 12px; border-radius: 4px; border: 1px solid #FFAAAA;';
    console.log("%cMade by BAUX", style)
    const main = document.getElementById('main');
    Scrollbar.use(ScrollbarCustomPlugin)
    const options = {
      damping: 0.075,
      renderByPixels: false,
    };

    if (main) {
      this.scrollbar = Scrollbar.init(main, options)
      this.scrollbar.addListener(({ offset }: any) => {
        const header = document.getElementById('head')!;
        const scrollUp = "scroll-up";
        const scrollDown = "scroll-down";
        const currentScroll = offset.y;
        if (currentScroll <= 10) {
          header.classList.remove(scrollUp);
          return;
        }
        if (currentScroll > this.lastScroll && !header.classList.contains(scrollDown)) {
          header.classList.remove(scrollUp);
          header.classList.add(scrollDown);
        } else if (
          currentScroll < this.lastScroll &&
          header.classList.contains(scrollDown)
        ) {
          header.classList.remove(scrollDown);
          header.classList.add(scrollUp);
        }
        this.lastScroll = currentScroll;
      });
    }
    const streamers: any = await this.sanityServices.getStreamers()
    .catch(error => {
      console.log(error);
    });

    if (streamers) {
      this.streamersList = streamers;
      await this.getStreamersIds(this.streamersList);
    }


    // if (this.streamersList === undefined || this.streamersList.length === 0) {
    //   this.streamersList = streamers.streamers;
    // } else {
    //   await this.getStreamersIds(this.streamersList);
    // }

    await this.sanityServices.getCategories();
    await this.sanityServices.getShownCategories();
    await this.sanityServices.getTeams();

    await this.sanityServices.getTeamMembers();
    await this.sanityServices.getNews();
    await this.sanityServices.getMatches();
    await this.sanityServices.getAchievements();

  }

  async getStreamersIds(streamersList: Array<any>) {
    const response: any = await this.socialServices.getTwitchUserId(streamersList)
    .catch(async err => {
      console.log('Se ha producido un error al intentar obtener los User_id de twitch.');
      if (err !== undefined) {
        console.log(err);
        if (err.error.error === 'Unauthorized' && err.error.message === 'Invalid OAuth token') {
          await this.refreshTwitchToken();
        }
      }
    });

    if (response) {
      let newListStreamers: any[] = [];
      response.data.forEach((stream: any) => {
        const streamer = {
          user_image: '',
          user_id: '',
          username: '',
          offlineImage: '',
          onlineImage: ''
        }
        streamer.user_image = stream.profile_image_url;
        streamer.user_id = stream.id;
        streamer.username = stream.display_name;
        streamer.offlineImage = stream.offline_image_url
        newListStreamers.push(streamer)
      })
      // for (let i = 0; i < response.data.length; i++) {
      //   const streamer = {
      //     user_image: '',
      //     user_id: '',
      //     username: ''
      //   }
      //   streamer.user_image = response.data[i].profile_image_url;
      //   streamer.user_id = response.data[i].id;
      //   streamer.username = response.data[i].display_name;
      //   newListStreamers.push(streamer);
      // }

      localStorage.setItem('streamers', JSON.stringify(newListStreamers));
    }
  }

  disableScrollbar(event: any) {
    const open = event;
    this.scrollbar.updatePluginOptions('custom', {open})
  }

  async refreshTwitchToken() {
    const response: any = await this.socialServices.refreshTwitchToken()
    .catch(err => {
      console.log(err);
    });

    if (response !== undefined) {
      console.log('Se refresheó twitch access token');
    }
   }

  onActivate(event: any) {
    let layerClass = ".left-layer";
    let layers = document.querySelectorAll(layerClass);
    if (!this.loading) {
      layers.forEach((layer: any) => {
        layer.classList.toggle('active')
      })
    }
  }
}
