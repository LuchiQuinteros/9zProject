import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Configuration } from '../configuration';
import youtubeCredentials from '../../assets/credentials/youtubeCredentials.json';
import { Meta, Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { EnvironmentVariablesService } from './environment-variables.service';
import { SanityService } from './sanity.services';

@Injectable({
  providedIn: 'root',
})
export class SocialService {
  youtubeAccessToken: string = '';

  constructor(
    private httpClient: HttpClient,
    private config: Configuration,
    private meta: Meta,
    private titleService: Title,
    private router: Router,
    private sanityServices: SanityService,
    private environmentServices: EnvironmentVariablesService
  ) {
    this.config.loadData().then((newData) => {
      this.config = newData;
    });

    // this.youtubeAccessToken = localStorage.getItem('youtubeAccessToken') || '';

    // if (this.youtubeAccessToken === '') {
    //   const credentials = {
    //     clientId: this.config.youtubeCredentials.clientId,
    //     client_secret: this.config.youtubeCredentials.secretClient,
    //     refresh_token: this.config.youtubeCredentials.refreshToken,
    //     grant_type: 'refresh_token',
    //   };

    //   this.getNewAccessToken(credentials);
    // }
  }

  async getAccountId() {
    const httpOptions = {
      headers: new HttpHeaders({
        Authorization: this.config.twitterCredentials.token,
      }),
    };

    const response: any = await this.httpClient
      .get<any>(
        `${this.config.twitterCredentials.api_url}/users/by/username/${this.config.twitterCredentials.username}`,
        httpOptions
      )
      .toPromise();
    return response.data.id;
  }

  async getTweets() {
    let response: any = await this.httpClient
    .get<any>(
      `${this.environmentServices.netlifyUrl}/.netlify/functions/twitter-get-tweets`
    )
    .toPromise();

    if (response?.response) {
      response = response.response;
    }

    return response;
  }

  async getTweetsByHashtag(hashtag: string) {
    let params = new HttpParams({
      fromObject: {
        query: hashtag,
        expansions: 'author_id',
        'user.fields': 'profile_image_url',
        'tweet.fields': 'created_at',
        max_results: 12,
      },
    });

    const response: any = await this.httpClient
      .get<any>(
        `${this.config.proxyHeroku}/${this.config.twitterCredentials.api_url}/tweets/search/recent`,
        {
          params: params,
          headers: new HttpHeaders({
            Authorization: this.config.twitterCredentials.token,
          }),
        }
      )
      .toPromise();

    return response;
  }

  async getTweetsByHashtagNextPage(hashtag: string, nextToken: string) {
    let params = new HttpParams({
      fromObject: {
        query: hashtag,
        next_token: nextToken,
        expansions: 'author_id',
        'user.fields': 'profile_image_url',
      },
    });

    const response: any = await this.httpClient
      .get<any>(
        `${this.config.proxyHeroku}/${this.config.twitterCredentials.api_url}/tweets/search/recent`,
        {
          params: params,
          headers: new HttpHeaders({
            Authorization: this.config.twitterCredentials.token,
          }),
        }
      )
      .toPromise();

    return response;
  }

  async getStreams(streamersList: Array<any>) {
    let params = new HttpParams({
      fromObject: {
        first: '5',
      },
    });
    streamersList.forEach((streamer: any) => {
      params = params.append('user_id', streamer.user_id);
    })
    // for (let i = 0; i < streamersList.length; i++) {
    //   params = params.append('user_id', streamersList[i].user_id);
    // }

    const response: any = await this.httpClient
      .get<any>(`${this.config.twitchCredentials.api_url}/streams`, {
        params: params,
        headers: new HttpHeaders({
          Authorization: this.config.twitchCredentials.accessToken,
          'Client-Id': this.config.twitchCredentials.clientId,
        }),
      })
      .toPromise();

    return response;
  }

  async getTwitchUserId(usernameList: Array<any>) {
    let params = new HttpParams({
      fromObject: {},
    });

    usernameList.forEach((user: any) => {
      params = params.append('login', user.username)
    })
    // for (let i = 0; i < usernameList.length; i++) {
    //   params = params.append('login', usernameList[i].user_login);
    // }

    if (this.config.twitchCredentials.accessToken === '') {
      setTimeout(async () => {
        this.config.loadData().then(async (newData) => {
          this.config = newData;
          const response: any = await this.httpClient
          .get<any>(`${this.config.twitchCredentials.api_url}/users`, {
            params: params,
            headers: new HttpHeaders({
              Authorization: this.config.twitchCredentials.accessToken,
              'Client-Id': this.config.twitchCredentials.clientId,
            }),
          })
          .toPromise()
          .catch(async err => {
            console.log('Se ha producido un error al intentar obtener los User_id de twitch.');
            if (err?.error) {
              console.log(err);
              if (err.error.error === 'Unauthorized' && err.error.message === 'Invalid OAuth token') {
                return err;
              }
            }
          });

      return response;
        });
      }, 850)

    } else {
      const response: any = await this.httpClient
        .get<any>(`${this.config.twitchCredentials.api_url}/users`, {
          params: params,
          headers: new HttpHeaders({
            Authorization: this.config.twitchCredentials.accessToken,
            'Client-Id': this.config.twitchCredentials.clientId,
          }),
        })
        .toPromise();

      return response;
    }

  }

  async getStreamsByUserId(userId: string) {
    let params = new HttpParams({
      fromObject: {
        user_id: userId,
        first: '5',
      },
    });

    const response: any = await this.httpClient
      .get<any>(`${this.config.twitchCredentials.api_url}/videos`, {
        params: params,
        headers: new HttpHeaders({
          Authorization: this.config.twitchCredentials.accessToken,
          'Client-Id': this.config.twitchCredentials.clientId,
        }),
      })
      .toPromise();

    return response;
  }

  async refreshTwitchToken() {
    let res: any = await fetch(
      `${this.environmentServices.netlifyUrl}/.netlify/functions/twitch-get-token`,
      {
        method: 'POST',
      }
    );
    res = await res.json();
    res = res.data;

    console.log(res);

    if (res.data !== undefined) {
      const accessToken = res.data.response.access_token;

        const result: any = await this.sanityServices.getTwitchAccessToken()
        .catch(error => {
          console.log(error);
        });

        if (result !== undefined) {
          if (result[0]._id !== undefined) {
            const resp: any = await this.sanityServices.updateTwitchAccessToken(result[0]._id, accessToken)
            .catch(error => {
              console.log(error);
            });

            if (resp !== undefined) {
              console.log(resp);
            }
          }
        }

    }

    return res;
  }

  // async refreshAccessTokenYoutube(credentials: any) {
  //   let params = new HttpParams({
  //     fromObject: {
  //       client_id: credentials.clientId,
  //       client_secret: credentials.client_secret,
  //       refresh_token: credentials.refresh_token,
  //       grant_type: credentials.grant_type,
  //     },
  //   });

  //   const response: any = await this.httpClient
  //     .post<any>('https://oauth2.googleapis.com/token', null, {
  //       params: params,
  //       headers: new HttpHeaders({
  //         'content-type': 'application/x-www-form-urlencoded',
  //       }),
  //     })
  //     .toPromise();

  //   return response;
  // }

  // async getNewAccessToken(credentials: any) {
  //   const response: any = await this.refreshAccessTokenYoutube(
  //     credentials
  //   ).catch((err) => {
  //     console.log(err);
  //   });

  //   if (response !== null && response !== undefined) {
  //     let accessToken = `Bearer ${response.access_token}`;

  //     localStorage.setItem('youtubeAccessToken', accessToken);
  //   }
  // }

  async getVideosByChannelId() {
    let params = new HttpParams({
      fromObject: {
        key: this.config.youtubeCredentials.apiKey,
        channelId: this.config.youtubeCredentials.channelId,
        part: 'id',
        order: 'date',
        maxResults: '30',
      },
    });

    // this.youtubeAccessToken = localStorage.getItem('youtubeAccessToken') || '';

    const response: any = await this.httpClient
      .get<any>(`${this.config.youtubeCredentials.api_url}/search`, {
        params: params,
        // headers: new HttpHeaders({
        //   Authorization: this.youtubeAccessToken,
        // }),
      })
      .toPromise();
    return response;
  }

  async getPlaylist() {

    let params = new HttpParams({
      fromObject: {
        key: this.config.youtubeCredentials.apiKey,
        part: 'id,snippet,contentDetails',
        maxResults: '30',
        channelId: this.config.youtubeCredentials.channelId,
      },
    });

    const response: any = await this.httpClient
    .get<any>(`${this.config.youtubeCredentials.api_url}/playlists`, {
      params: params,
      // headers: new HttpHeaders({
      //   Authorization: this.youtubeAccessToken,
      // }),
    })
    .toPromise();
    let playlists =  await this.getPlaylistPublish(response.items);
    return playlists;
  }

  async getPlaylistItems(id: string, playlistName: string) {

    let params = new HttpParams({
      fromObject: {
        key: this.config.youtubeCredentials.apiKey,
        part: 'contentDetails',
        maxResults: '30',
        playlistId: id,
      },
    });

    const response: any = await this.httpClient
    .get<any>(`${this.config.youtubeCredentials.api_url}/playlistItems`, {
      params: params,

      // headers: new HttpHeaders({
      //   Authorization: this.youtubeAccessToken,
      // }),
    })
    .toPromise();
    let playlists: any =  {
      name: playlistName,
      videosId: [],
    }

    if (response !== null && response !== undefined) {
      response.items.forEach((item: any) => item ? playlists.videosId.push(item.contentDetails.videoId) : null)
      // for(let item of response.items) {
      //   if(item) {
      //     playlists.videosId.push(item.contentDetails.videoId);
      //    }
      // }
    }
    return playlists;
  }


 async getPlaylistPublish(playlists: Array<any>) {
  console.log(playlists)
;  let content: any[] = [];
  //  this.config.youtubeCredentials.playlistNames.forEach(async (playlistName: any) => {
  //     playlists.forEach(async (playlist: any) => {

  //         if (playlist.snippet.title === playlistName) {
  //           const playlistData = await this.getPlaylistItems(playlist.id, playlist.snippet.title).catch(error => {
  //             console.log(error)
  //           })
  //           console.log(playlistData)
  //           if (playlistData) {
  //             const response = await this.getVideoInformationByIds(playlistData.videosId).catch((error => {
  //               console.log(error)
  //             }))
  //             console.log(response)
  //             if (response) {
  //               playlist.videosData = response.items
  //               content.push(playlistData)
  //               console.log(content)
  //             }
  //           }
  //         }
  //       }
  //     )}
  //   )
    for (let i = 0; i < this.config.youtubeCredentials.playlistNames.length; i++) {
      for (let playlist of playlists) {
        if (playlist.snippet.title === this.config.youtubeCredentials.playlistNames[i]) {

          const playlistData: any = await this.getPlaylistItems(playlist.id, playlist.snippet.title)
          .catch(error => {
            console.log(error);
          });

          if (playlistData !== undefined) {
            const response  = await this.getVideoInformationByIds(playlistData.videosId)
            .catch(error => {
              console.log(error);
            });

            if (response !== undefined) {
              playlistData.videosData = response.items;
              content.push(playlistData)
            }
          }

          break;
        }
      }
    }
    return content
  }

  async getVideoInformationByIds(videosIds: Array<any>) {

    let params = new HttpParams({
      fromObject: {
        key: this.config.youtubeCredentials.apiKey,
        part: 'snippet,contentDetails,id,statistics',
      },
    });

    let ids = '';

    for (let i = 0; i < videosIds.length; i++) {
      if (ids === '') {
        ids = `${videosIds[i]}`;
      } else {
        ids = `${ids},${videosIds[i]}`;
      }
    }
    params = params.append('id', ids);

    // this.youtubeAccessToken = localStorage.getItem('youtubeAccessToken') || '';

    const response: any = await this.httpClient
      .get<any>(`${this.config.youtubeCredentials.api_url}/videos`, {
        params: params,
        // headers: new HttpHeaders({
        //   Authorization: this.youtubeAccessToken,
        // }),
      })
      .toPromise();
    return response;
  }

  updateMetaTags(title: string, image?: string) {
    this.titleService.setTitle(title);
    this.meta.updateTag({
      property: 'description',
      content: 'E-SPORT ORGANIZATION',
    });
    // this.meta.updateTag({
    //   name: 'title',
    //   content: 'Prueba'
    // });

    this.meta.updateTag({ property: 'og:type', content: 'website' });
    this.meta.updateTag({
      property: 'og:url',
      content: 'https://' + window.location.hostname + this.router.url,
    });
    this.meta.updateTag({ property: 'og:site_name', content: '9Z TEAM' });
    this.meta.updateTag({ property: 'og:title', content: title });
    this.meta.updateTag({
      property: 'og:description',
      content: 'E-SPORT ORGANIZATION',
    });
    this.meta.updateTag({
      property: 'og:image',
      itemprop: 'image',
      content: window.location.hostname + '/assets/metaimg.png',
    });

    //TWITTER
    this.meta.updateTag({ property: 'twitter:card', content: 'summary' });
    this.meta.updateTag({
      property: 'twitter:description',
      content: 'E-SPORT ORGANIZATION',
    });
    this.meta.updateTag({
      property: 'twitter:image',
      content: window.location.hostname + '/assets/metaimg.png',
    });
    this.meta.updateTag({ property: 'twitter:title', content: 'title' });
    this.meta.updateTag({ property: 'twitter:site', content: '@9zTeam' });
  }
}
