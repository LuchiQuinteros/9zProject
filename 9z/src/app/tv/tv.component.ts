import { Component, Input, OnInit } from '@angular/core';
import SwiperCore, {
  SwiperOptions,
} from "swiper";
import { SocialService } from '../services/social.service';
import { Configuration } from '../configuration';
import youtubeVideoStorage from '../../assets/credentials/youtubeVideoStorage.json';
import { AppComponent } from '../app.component';
import { SanityService } from '../services/sanity.services';
import { CommonService } from '../services/common.service';

@Component({
  selector: 'app-tv',
  templateUrl: './tv.component.html',
  styleUrls: ['./tv.component.scss']
})
export class TVComponent implements OnInit {

  twitchStreamList: Array<any> = [];
  streamersList: Array<any> = [];
  youtubeVideosList: Array<any> = [];
  claroVideosList: Array<any> = [];
  videosIds: Array<any>= [];
  videoGalleries: any[] = [];
  upcomingMatchList: Array<any> = [];
  pastMatchList: Array<any> = [];

  constructor(
    private socialServices: SocialService,
    private config: Configuration,
    private appComponent: AppComponent,
    private commonServices: CommonService,
    private sanityServices: SanityService,
  ) {
    this.config.loadData().then(newData => {
      this.config = newData;
    });
  }

  async ngOnInit() {
    this.socialServices.getPlaylist();
    await this.getVideoGalleries();
    this.streamersList = JSON.parse(localStorage.getItem('streamers') || 'null');
    const jsonMatches = JSON.parse(localStorage.getItem('matches')!);
    const claroVideos = JSON.parse(localStorage.getItem('claroVideos') || 'null');
    this.twitchStreamList = [];
    this.youtubeVideosList = [];
    this.videosIds = [];
    // this.claroVideosList = [];

    if  (!jsonMatches || !this.streamersList) {
      const streamers: any = await this.sanityServices.getStreamers()
      .catch(error => {
        console.log(error);
      });

      await this.sanityServices.getMatches();
      setTimeout(async () => {
        const jsonMatches = JSON.parse(
          localStorage.getItem('matches')!
        );
        this.getMatchesLists(jsonMatches);
      }, 1000);

      if (streamers) {
        this.streamersList = streamers;
        await this.appComponent.getStreamersIds(this.streamersList);
      }

      // this.sanityServices.getClaroVideos();
      setTimeout(async() => {
        this.streamersList = JSON.parse(localStorage.getItem('streamers')!);
        const claroVideos = JSON.parse(localStorage.getItem('claroVideos') || 'null');
        if (claroVideos?.result) {
          this.claroVideosList = claroVideos.result.slice(0, 3)
        }

        await this.getStreams(this.streamersList);
        await this.getYoutubePlaylistVideos();
        this.streamersList.forEach(async (streamer: any) => await this.getStreamsByUserId(streamer.user_id))

      }, 1000);
    } else {
      await this.getStreams(this.streamersList);
      this.getMatchesLists(jsonMatches);

      if (claroVideos?.result) {
        this.claroVideosList = claroVideos.result.slice(0, 3);
      }

      if (claroVideos?.result !== null && claroVideos?.result !== undefined) {
        for (let i = 0; i < 3; i++) {
          this.claroVideosList.push(claroVideos.result[i]);
        }
      }
      await this.getYoutubePlaylistVideos();
      this.streamersList.forEach(async (streamer: any) => await this.getStreamsByUserId(streamer.user_id))
    }
    this.socialServices.updateMetaTags('TV');
  }

  async getVideoGalleries() {
    const response: any = await this.sanityServices.getVideoGalleries()
    .catch(error => {
      console.log(error);
    });

    if (response) {
      this.videoGalleries = response;
    }
  }

  async getTwitchUserId(username: Array<any>) {
    const response: any = await this.socialServices.getTwitchUserId(username)
    .catch(async err => {
      console.log('Se ha producido un error al intentar obtener los User_id de twitch.');
      if (err !== undefined) {
        console.log(err);
        if (err?.error?.error === 'Unauthorized' && err.error.message === 'Invalid OAuth token') {
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
    const twitchStreams = await this.socialServices.getStreams(streamersList)
    .catch(async (err) => {
      console.log('Se ha producido un error al intentar obtener los streams.');
      if (err !== undefined) {
        console.log(err);
        if (err.error.error === 'Unauthorized' && err.error.message === 'Invalid OAuth token') {
          await this.refreshTwitchToken();
        }
      }
    });
    if (twitchStreams) {
      twitchStreams.data.forEach((stream: any) => {
        stream.thumbnail_url = stream.thumbnail_url.replace('{width}', '1280'),
        stream.thumbnail_url = stream.thumbnail_url.replace('{height}', '720');
        this.streamersList.forEach((streamer: any) => {
          if (stream.user_id === streamer.user_id) {
            stream.user_image = streamer.user_image
            if (stream.type === 'live') {
              streamer.isLive = 'live'
              streamer.offlineImage = stream.thumbnail_url
            }
          }
        })
      })
      this.twitchStreamList = twitchStreams.data;

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

  async getStreamsByUserId(userId: string) {
    const twitchStreams = await this.socialServices.getStreamsByUserId(userId)
    .catch(async (err) => {
      console.log('Se ha producido un error al intentar obtener los streams.');
      if (err !== undefined) {
        console.log(err);
        if (err.error.error === 'Unauthorized' && err.error.message === 'Invalid OAuth token') {
          await this.refreshTwitchToken();
        }
      }
    });
    if (twitchStreams) {
      twitchStreams.data.forEach((stream: any) => {
        stream.thumbnail_url = stream.thumbnail_url.replace('%{width}', '1280'),
        stream.thumbnail_url = stream.thumbnail_url.replace('%{height}', '720');
        this.streamersList.forEach((streamer: any) => {
          if (stream.user_id === streamer.user_id) {
            stream.user_image = streamer.user_image
            if (stream.type === 'live') {
              streamer.isLive = 'live';
              streamer.offlineImage = stream.thumbnail_url
            }
          }
        })
      })
      this.twitchStreamList = this.twitchStreamList.concat(twitchStreams.data);
    }
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

  async getYoutubePlaylistVideos() {
    const videos: any = await this.socialServices.getPlaylist();
    if (videos) {
      this.getVideoInformationByIds(videos);
    }

  }
  // async getYoutubeVideos() {

  //   const youtubeVideos: any = await this.socialServices.getPlaylist()
  //   .catch(async err => {
  //     console.log(err);
  //     if (err.status === 401) {
  //       // const credentials = {
  //       //   clientId: this.config.youtubeCredentials.clientId,
  //       //   client_secret: this.config.youtubeCredentials.secretClient,
  //       //   refresh_token: this.config.youtubeCredentials.refreshToken,
  //       //   grant_type: 'refresh_token',
  //       // };
  //       // const response: any = await this.socialServices.refreshAccessTokenYoutube(credentials)
  //       // .catch(err => {
  //       //   console.log(err);
  //       // });

  //       // if (response !== null && response !== undefined) {
  //       //   let accessToken = `Bearer ${response.access_token}`;

  //       //   localStorage.setItem('youtubeAccessToken', accessToken);

  //       //   const newYoutubeVideos: any = await this.socialServices.getVideosByChannelId()
  //       //   .catch(err => {
  //       //     console.log(err);
  //       //   });

  //       //   if (newYoutubeVideos !== null && newYoutubeVideos !== undefined) {
  //       //     for (let i = 0; i < newYoutubeVideos.items.length; i++) {
  //       //       this.videosIds.push(newYoutubeVideos.items[i].id.videoId);
  //       //     }
  //       //     let localVideosIds = JSON.parse(localStorage.getItem('videosIds') || 'null');

  //       //     if (localVideosIds !== undefined && localVideosIds !== null && localVideosIds !== 'null') {
  //       //       let flagNewVideo: boolean = false;

  //       //       for (let i = 0; i < this.videosIds.length; i++) {
  //       //         if (localVideosIds.indexOf(this.videosIds) === -1) {
  //       //           flagNewVideo = true;
  //       //         }
  //       //       }

  //       //       if (flagNewVideo === true) {
  //       //         localStorage.setItem('videosIds', JSON.stringify(this.videosIds));
  //       //         await this.getVideoInformationByIds(this.videosIds);
  //       //       } else {
  //       //         this.youtubeVideosList = JSON.parse(localStorage.getItem('youtubeVideoList') || '[]');
  //       //       }

  //       //     } else {
  //       //       localStorage.setItem('videosIds', JSON.stringify(this.videosIds));
  //       //       await this.getVideoInformationByIds(this.videosIds);
  //       //     }
  //       //   }
  //       // }
  //     } else if (err.status === 403) {
  //       this.youtubeVideosList = youtubeVideoStorage.data;
  //     }
  //   });

  //   if (youtubeVideos !== null && youtubeVideos !== undefined) {
  //     for (let i = 0; i < youtubeVideos.items.length; i++) {
  //       this.videosIds.push(youtubeVideos.items[i].snippet.resourceId.videoId);
  //     }
  //     this.socialServices.getVideoInformationByIds(this.videosIds);
  //     let localVideosIds = JSON.parse(localStorage.getItem('videosIds') || 'null');

  //     if (localVideosIds !== undefined && localVideosIds !== null && localVideosIds !== 'null') {
  //       let flagNewVideo: boolean = false;

  //       for (let i = 0; i < this.videosIds.length; i++) {
  //         if (localVideosIds.indexOf(this.videosIds[i]) === -1) {
  //           flagNewVideo = true;
  //         }
  //       }

  //       if (flagNewVideo === true) {
  //         localStorage.setItem('videosIds', JSON.stringify(this.videosIds));
  //         await this.getVideoInformationByIds(this.videosIds);
  //       } else {
  //         this.youtubeVideosList = JSON.parse(localStorage.getItem('youtubeVideoList') || '[]');
  //       }

  //     } else {
  //       localStorage.setItem('videosIds', JSON.stringify(this.videosIds));
  //       await this.getVideoInformationByIds(this.videosIds);
  //     }
  //   }

  // }

  async getVideoInformationByIds(videosIds:any) {

    if (videosIds){
      videosIds.forEach((preplaylist: any) => {
        preplaylist.videosData.forEach((playlist: any) => {
          playlist.duration = this.parserDuration(playlist.contentDetails.duration)
          playlist.created = 0;
          playlist.timestamp = new Date(playlist.snippet.publishedAt);
          let startDate = new Date();
          playlist.created = (playlist.timestamp.getTime() - startDate.getTime()) / 1000 / 60 / 60 * -1;

          if (playlist.created > 24) {
            playlist.createdDays = playlist.created / 24;
          }
        })
        preplaylist.videosData.sort((a: any, b: any) => {
          if(a.createdDays > b.createdDays) {
            return 1
          }
          if(a.createdDays < b.createdDays) {
            return -1
          }
          return 0
        });
      })
    }
    // for(let playlist of videosIds) {
    //   for (let i = 0; i < playlist.videosData.length; i++) {
    //     playlist.videosData[i].duration = this.parserDuration(playlist.videosData[i].contentDetails.duration);
    //     playlist.videosData[i].created = 0;
    //     playlist.videosData[i].timestamp = new Date(playlist.videosData[i].snippet.publishedAt);

    //     let startDate = new Date();
    //     playlist.videosData[i].created = (playlist.videosData[i].timestamp.getTime() - startDate.getTime()) / 1000 / 60 / 60 * -1;

    //     if (playlist.videosData[i].created > 24) {
    //       playlist.videosData[i].createdDays = playlist.videosData[i].created / 24;
    //     }

    //   }

    //   playlist.videosData.sort((a: any, b: any) => {
    //     if(a.createdDays > b.createdDays) {
    //       return 1
    //     }
    //     if(a.createdDays < b.createdDays) {
    //       return -1
    //     }
    //     return 0
    //   });
    // }
    this.youtubeVideosList = videosIds;
    localStorage.setItem('youtubeVideoList', JSON.stringify(this.youtubeVideosList));
  }

  parserDuration(duration: string) {
    duration = duration.split('PT').pop() || '';

    let hours = '';
    let minutes = '';
    let seconds = '';
    let newDuration = '';

    if (duration.indexOf('H') !== -1) {
      hours = duration.substring(0, duration.indexOf('H'));

      if (duration.indexOf('M') !== -1) {
        minutes = duration.substring((duration.indexOf('H') + 1), duration.indexOf('M'));
        if (minutes.length === 1) {
          minutes = `0${minutes}`;
        }
      } else {
        minutes = '00';
      }

      if (duration.indexOf('S') !== -1) {
        seconds = duration.substring((duration.indexOf('H') + 1), duration.indexOf('M'));

        if (seconds.length === 1) {
          seconds = `0${seconds}`;
        }
      } else {
        seconds = '00';
      }

      newDuration = `${hours}:${minutes}:${seconds}`;
    } else if (duration.indexOf('M') !== -1) {
      minutes = duration.substring(0, duration.indexOf('M'));

      if (minutes.length === 1) {
        minutes = `0${minutes}`;
      }

      if (duration.indexOf('S') !== -1) {
        seconds = duration.substring((duration.indexOf('M') + 1), duration.indexOf('S'));

        if (seconds.length === 1) {
          seconds = `0${seconds}`;
        }
      } else {
        seconds = '00';
      }

      newDuration = `${minutes}:${seconds}`;

    } else if (duration.indexOf('S') !== -1) {
      seconds = duration.substring(0, duration.indexOf('S'));

      if (seconds.length === 1) {
        seconds = `0${seconds}`;
      }

      newDuration = `00:${seconds}`;
    }

    return newDuration;
  }

  scrollIntoView(id: string) {
    const element = document.getElementById(id);
    element?.scrollIntoView({
      behavior: 'smooth', block: 'nearest'
    });
  }

}
