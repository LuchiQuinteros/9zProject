import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SocialService } from '../services/social.service';

@Component({
  selector: 'app-videos',
  templateUrl: './videos.component.html',
  styleUrls: ['./videos.component.scss']
})
export class VideosComponent implements OnInit {
  title: any = null;
  youtubeVideosList:any
  ready: boolean = false;
  allVideos: boolean = false;
  constructor( private activeRoute: ActivatedRoute, private socialServices: SocialService,) { }

  async ngOnInit() {
    this.ready = false;
    this.activeRoute.queryParams.subscribe(async routeParams => {
    this.title = routeParams?.category? routeParams.category : null;
    })
    await this.getYoutubePlaylistVideos();
  }
  async getYoutubePlaylistVideos() {
    const videos: any = await this.socialServices.getPlaylist();
    if (videos !== undefined) {
      this.getVideoInformationByIds(videos);
    }
  }

  async getVideoInformationByIds(videosIds:any) {
    videosIds.forEach((playlistList: any) => {
      playlistList.videosData.forEach((playlist: any) => {
        playlist.duration = this.parserDuration(playlist.contentDetails.duration);
        playlist.created = 0;
        playlist.timestamp = new Date(playlist.snippet.publishedAt)
        const startDate = new Date()
        playlist.created = (playlist.timestamp.getTime() - startDate.getTime()) / 1000 / 60 / 60 * -1;
        if (playlist.created > 24) {
          playlist.createdDays = playlist.created / 24;
        }
      });
      playlistList.videosData.sort((a: any, b: any) => {
        if (a.createdDays > b.createdDays) {
          return 1
        }
        if (a.createdDays < b.createdDays) {
          return -1
        }
        return 0
      });
      if (this.title === playlistList.name) {
        this.youtubeVideosList = playlistList;
        this.ready = true;
      } else if (this.title === null) {
        this.allVideos = true;
        this.youtubeVideosList = videosIds;
        this.ready = true;
      }
    });
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
    //   if (this.title === playlist.name) {
    //     this.youtubeVideosList = playlist;
    //     this.ready = true;
    //   } else if (this.title === null) {
    //     this.allVideos = true;
    //     this.youtubeVideosList = videosIds;
    //     this.ready = true;
    //   }
    // }

      // localStorage.setItem('youtubeVideoList', JSON.stringify(this.youtubeVideosList));
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
    let element = document.getElementById(id);

    element?.scrollIntoView({
      behavior: 'smooth', block: 'nearest'
    });
  }
}
