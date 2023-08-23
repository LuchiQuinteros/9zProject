import { Injectable } from '@angular/core';
import twitterCredentials from '../assets/credentials/twitterCredentials.json';
import twitchCredentials from '../assets/credentials/twitchCredentials.json';
import youtubeCredentials from '../assets/credentials/youtubeCredentials.json';
import herokuProxy from '../assets/credentials/proxyHeroku.json';
import { SanityService } from './services/sanity.services';

interface TwitterCredentials {
  api_url: string;
  api_key: string;
  api_key_secret: string;
  token: string;
  username: string;
  accountId: string;
}

interface TwitchCredentials {
  api_url: string;
  accessToken: string;
  clientId: string;
}

interface YoutubeCredentials {
  api_url: string;
  apiKey: string;
  clientId: string;
  secretClient: string;
  refreshToken: string;
  channelId: string;
  playlistId: string;
  secondPlaylistId: string;
  playlistNames: Array<string>;
}

@Injectable()
export class Configuration {
  public proxyHeroku: string = herokuProxy.proxy_heroku;

  public twitterCredentials: TwitterCredentials = {
    api_url: twitterCredentials.api_url,
    api_key: twitterCredentials.api_key,
    api_key_secret: twitterCredentials.api_key_secret,
    token: twitterCredentials.token,
    username: twitterCredentials.username,
    accountId: twitterCredentials.accountId,
  };

  public youtubeCredentials: YoutubeCredentials = {
    api_url: youtubeCredentials.api_url,
    apiKey: youtubeCredentials.apiKey,
    clientId: youtubeCredentials.clientId,
    secretClient: youtubeCredentials.secretClient,
    refreshToken: youtubeCredentials.refreshToken,
    channelId: youtubeCredentials.channelId9zTeam,
    playlistId: youtubeCredentials.playlistId,
    secondPlaylistId: youtubeCredentials.secondPlaylistId,
    playlistNames: youtubeCredentials.playlistNames,
  };

  public twitchCredentials: TwitchCredentials = {
    api_url: twitchCredentials.api_url,
    accessToken: twitchCredentials.accessToken,
    clientId: twitchCredentials.clientId,
  };

  constructor(private sanityServices: SanityService) {
    this.sanityServices.getTwitchAccessToken().then((response) => {
      if (response?.accessToken)
      this.twitchCredentials.accessToken = response.accessToken;
    });
  }

  loadData(): Promise<Configuration> {
    return new Promise<Configuration>((resolve) => {
      resolve(this);
    });
  }
}
