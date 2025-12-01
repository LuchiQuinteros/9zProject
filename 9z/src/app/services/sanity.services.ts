import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import * as moment from 'moment';
// import { createClient } from '@sanity/client';

// export const client = createClient({
//   projectId: '31xtqrng',
//   dataset: 'production',
//   useCdn: false, // set to `true` to fetch from edge cache
//   apiVersion: '2022-01-12', // use current date (YYYY-MM-DD) to target the latest API version
//   token: 'Bearer skL8NvFrTjCl0odLPnhpV8i7j7ra5ChjGzq1E8di4DKtV5jmvgyJGELp5CmInoaT0xwvoU93wLwFd5EspcKPqWGL6ZUzuw8CF1qdBkXmveK2Hzm8zcMS9X9lVdPnavjVjEJzeIY7rARiHfnkrElkqxVQHIH3anajESg02p8F5AAWbardLtzc' // Only if you want to update content with the client
// })

@Injectable({
  providedIn: 'root',
})
export class SanityService {
  token: string =
    'Bearer skL8NvFrTjCl0odLPnhpV8i7j7ra5ChjGzq1E8di4DKtV5jmvgyJGELp5CmInoaT0xwvoU93wLwFd5EspcKPqWGL6ZUzuw8CF1qdBkXmveK2Hzm8zcMS9X9lVdPnavjVjEJzeIY7rARiHfnkrElkqxVQHIH3anajESg02p8F5AAWbardLtzc';

  private cacheExpiration: number = 30 * 60 * 1000;

  constructor(
    private http: HttpClient,
  ) {}

  private isCacheValid(cacheKey: string): boolean {
    const cached = localStorage.getItem(cacheKey);
    if (!cached) return false;

    try {
      const data = JSON.parse(cached);
      if (!data.timestamp) return false;

      const now = new Date().getTime();
      return (now - data.timestamp) < this.cacheExpiration;
    } catch (e) {
      return false;
    }
  }

  private setCache(cacheKey: string, data: any): void {
    const cacheData = {
      timestamp: new Date().getTime(),
      data: data
    };
    localStorage.setItem(cacheKey, JSON.stringify(cacheData));
  }

  private getCache(cacheKey: string): any {
    const cached = localStorage.getItem(cacheKey);
    if (!cached) return null;

    try {
      const cacheData = JSON.parse(cached);
      return cacheData.data;
    } catch (e) {
      return null;
    }
  }


  clearCache(cacheKey?: string): void {
    if (cacheKey) {
      localStorage.removeItem(cacheKey);
      console.log(`Caché limpiado: ${cacheKey}`);
    } else {
      const keys = [
        'news', 'games', 'teams', 'categories', 'matches', 
        'achievements', 'shownCategories', 'teamMembers', 
        'videoGalleries', 'home', 'pageNews', 'sponsors',
        'streamers', 'youtubeRefreshToken'
      ];
      keys.forEach(key => localStorage.removeItem(key));
      console.log('Todo el caché de Sanity ha sido limpiado');
    }
  }

  async registerUser(form: any) {

    const member = {
      _type: 'member',
      name: form.name,
      birthdate: form.birthdate,
      email: form.email,
      nationality: form.nationality,
    }
    let r: any = await this.http
    .post<any>(
      `https://31xtqrng.api.sanity.io/v2022-01-12/data/mutate/production`,
      JSON.stringify(member),
      {
        headers: new HttpHeaders({
          Authorization: this.token,
          'content-type': 'application/json',
        }),
      }
    )
    .toPromise();

    console.log(r);
  }

  async getNews() {
    if (this.isCacheValid('news')) {
      console.log('Usando noticias desde caché');
      return;
    }

    console.log('Descargando noticias desde Sanity');
    
    let response: any = await this.http
    .get(
      `https://31xtqrng.api.sanity.io/v2022-01-12/data/query/production?query=*[_type == 'news']{
        date,
        "coverImageUrl": cover_image.asset->url + "?w=800&h=450",
        title,
        subtitle,
        subheader,
        resume,
        content,
        urlNew,
        readingTime,
        isFeaturedNew,
        "category": category->title,
        "game": game->{ name, "logo": logo.asset->url + "?w=100&h=100" },
        teamMember
      }
      `
    )
    .toPromise();

    response.result.forEach((post: any) => {
      var dateMomentObject = moment(post.date, 'DD/MM/YYYY');
      post.newDate = dateMomentObject.toDate();
      if (post.title) {
        post.slug = this.getName(post.title);
      }
      if (post.content) {
        post.newContent = this.convertBlockContentToHtml(post.content);
      }

      if (post.subheader) {
        post.newSubheader = this.convertBlockContentToHtml(post.subheader);
      }

      if (post.resume) {
        post.newResume = this.convertBlockContentToHtml(post.resume);
      }
    })


    if (response !== undefined) {
      response.result.sort((a: any, b: any) => a.newDate - b.newDate).reverse();

      this.setCache('news', response);
    }
  }

  async getGames() {
    if (this.isCacheValid('games')) {
      const cached = this.getCache('games');
      return cached?.result;
    }

    let response: any = await this.http
    .get(
      `https://31xtqrng.api.sanity.io/v2022-01-12/data/query/production?query=
      *[_type == 'game']{
        _id,
        name,
        "logoImageUrl": logo.asset->url + "?w=200&h=200"
      }`
    )
    .toPromise();

    if (response?.result) {
      this.setCache('games', response);
      return response.result;
    }
  }

  async getTeams() {
    if (this.isCacheValid('teams')) {
      console.log('Usando equipos desde caché');
      return;
    }

    console.log('Descargando equipos desde Sanity');
    
    let response: any = await this.http
    .get(
      `https://31xtqrng.api.sanity.io/v2022-01-12/data/query/production?query=
      *[_type == 'team']{
        _id,
        name,
        "logoImageUrl": logo.asset->url + "?w=200&h=200"
      }`
    )
    .toPromise();

    if (response !== undefined) {
      this.setCache('teams', response);
    }
  }

  async getCategories() {
    if (this.isCacheValid('categories')) {
      console.log('Usando categorías desde caché');
      return;
    }

    console.log('Descargando categorías desde Sanity');
    
    let response: any = await this.http
    .get(
      `https://31xtqrng.api.sanity.io/v2022-01-12/data/query/production?query=
      *[_type == 'categoryNews']{
        _id,
        title,
      }`
    )
    .toPromise();

    if (response !== undefined) {
      this.setCache('categories', response);
    }
  }

  async getMatches() {
    if (this.isCacheValid('matches')) {
      console.log('Usando partidas desde caché');
      return;
    }

    console.log('Descargando partidas desde Sanity');
    
    let response: any = await this.http
    .get(
      `https://31xtqrng.api.sanity.io/v2022-01-12/data/query/production?query=
      *[_type == 'match']{
        date,
        time,
        tournament,
        "team1": team1->{ name, "logo": logo.asset->url + "?w=100&h=100" },
        "team2": team2->{ name, "logo": logo.asset->url + "?w=100&h=100" },
        "game": game->{ name, "logo": logo.asset->url + "?w=100&h=100" },
        result1,
        result2,
        "teamMember": teamMember->slug,
        position,
        streamUrl,
      }`
    )
    .toPromise();

    response.result.forEach((match: any) => {
      var dateMomentObject = moment(match.date, 'DD/MM/YYYY');
      match.newDate = dateMomentObject.toDate()
    })

    if (response !== undefined) {
      response.result.sort((a: any, b: any) => a.newDate - b.newDate).reverse();
      this.setCache('matches', response);
    }
  }

  async getAchievements() {
    if (this.isCacheValid('achievements')) {
      console.log('Usando logros desde caché');
      return;
    }

    console.log('Descargando logros desde Sanity');
    
    let response: any = await this.http
    .get(
      `https://31xtqrng.api.sanity.io/v2022-01-12/data/query/production?query=
      *[_type == 'achievement']{
        date,
        position,
        tournament,
        "game": game->{ name, "logo": logo.asset->url + "?w=100&h=100" }
      }`
    )
    .toPromise();

    response.result.forEach((achievement: any) => {
      var dateMomentObject = moment(achievement.date, 'DD/MM/YYYY');
      achievement.newDate = dateMomentObject.toDate()
    })

    if (response !== undefined) {
      this.setCache('achievements', response);
    }
  }

  async getShownCategories() {
    if (this.isCacheValid('shownCategories')) {
      console.log('Usando categorías mostradas desde caché');
      return;
    }

    console.log('Descargando categorías mostradas desde Sanity');
    
    let response: any = await this.http
    .get(
      `https://31xtqrng.api.sanity.io/v2022-01-12/data/query/production?query=
      *[_type == 'shownCategories']{
        "category1": category1->title,
        "category2": category2->title,
        "category3": category3->title
      }`
    )
    .toPromise();

    if (response !== undefined) {
      this.setCache('shownCategories', response);
    }
  }

  async getSocialNetwork() {
    let response: any = await this.http
    .get(
      `https://31xtqrng.api.sanity.io/v2022-01-12/data/query/production?query=
      *[_type == 'socialnetwork']{
        twitter,
        instagram,
        youtube,
        linkedin,
        discord,
        twitch,
        tiktok
      }`
    )
    .toPromise();

    if (response?.result) {
      let json = response.result[0];
      for (let key in json){
        json[key] = this.formatNumber(json[key]);
      }
      return json;
    }
  }

  async getLegal(content: string) {
    let response: any = await this.http
    .get(
      `https://31xtqrng.api.sanity.io/v2022-01-12/data/query/production?query=
      *[_type == 'legal']{
        ${content}
      }`
    )
    .toPromise();

    if (response?.result) {
      for (let key in response.result[0]){
        response.result[0].content = this.convertBlockContentToHtml(response.result[0][key]);
      }

      return response.result[0];
    }
  }

  async getStreamers() {
    if (this.isCacheValid('streamers')) {
      const cached = this.getCache('streamers');
      return cached;
    }

    let response: any = await this.http
    .get(
      `https://31xtqrng.api.sanity.io/v2022-01-12/data/query/production?query=
      *[_type == 'streamers']{
        username,
      }`
    )
    .toPromise();

    if (response?.result) {
      this.setCache('streamers', response.result);
      return response.result;
    }
  }

  formatNumber(num: number): string {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + "M";
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + "k";
    } else {
      return num.toString();
    }
  }

  async getVideoGalleries() {
    if (this.isCacheValid('videoGalleries')) {
      const cached = this.getCache('videoGalleries');
      return cached;
    }

    let response: any = await this.http
    .get(
      `https://31xtqrng.api.sanity.io/v2022-01-12/data/query/production?query=
      *[_type == 'videoGallery'] | order(_createdAt){
        title,
        layout,
        "videos": videos[]{
          title,
          tag,
          "preview": preview.asset->url + "?w=640&h=360",
          url
        },
      }`
    )
    .toPromise();

    if (response!.result) {
      const result = response.result.reverse();
      this.setCache('videoGalleries', result);
      return result;
    }
  }

  async getHome() {
    if (this.isCacheValid('home')) {
      const cached = this.getCache('home');
      return cached;
    }

    let response: any = await this.http
    .get(
      `https://31xtqrng.api.sanity.io/v2022-01-12/data/query/production?query=
      *[_type == 'home']{
        title,
        "imageHero": heroImage.asset->url + "?w=1920&h=1080",
        "imageHeroMob": heroImageMob.asset->url + "?w=768&h=1024",
        titleCTA,
        localRedirect,
        urlCTA
      }`
    )
    .toPromise();

    if (response!.result) {
      const result = response.result[0];
      this.setCache('home', result);
      return result;
    }
  }

  async getPageNews() {
    if (this.isCacheValid('pageNews')) {
      const cached = this.getCache('pageNews');
      return cached;
    }

    let response: any = await this.http
    .get(
      `https://31xtqrng.api.sanity.io/v2022-01-12/data/query/production?query=
      *[_type == 'pageNews']{
        "imageHero": heroImage.asset->url + "?w=1920&h=600",
        "heroNews": heroNews[]->{
          date,
          "coverImageUrl": cover_image.asset->url + "?w=600&h=400",
          title,
          subtitle,
          urlNew,
        },
        "featuredNews": featuredNews[]->{
          date,
          "coverImageUrl": cover_image.asset->url + "?w=400&h=300",
          title,
          readingTime,
          urlNew,
          resume,
        },
        "bannerNew": bannerNew->{
          date,
          "coverImageUrl": cover_image.asset->url + "?w=800&h=450",
          title,
          subtitle,
          urlNew,
          resume,
        },
      }`
    )
    .toPromise();

    if (response!.result) {
      response.result[0].featuredNews.forEach((post: any) => {
        post.newResume = this.convertBlockContentToHtml(post.resume)
      })
      response.result[0].bannerNew.newResume = this.convertBlockContentToHtml(response.result[0].bannerNew.resume);
      
      const result = response.result[0];
      this.setCache('pageNews', result);
      return result;
    }
  }

  async getSponsorsByPage(page: string) {
    const cacheKey = `sponsors_${page}`;
  
    if (this.isCacheValid(cacheKey)) {
      const cached = this.getCache(cacheKey);
      return cached;
    }

    const queryUrl: string = 'https://31xtqrng.api.sanity.io/v2021-10-21/data/query/production?query=';
    const query: string = `*[_type == 'sponsors' && pageName == '${page}']{
      pageName,
      "logos": logos[]{
        name,
        "logo": logo.asset->url + "?w=300&h=150"
      }
    }`;
    const url = `${queryUrl}${encodeURIComponent(query)}`

    let response: any = await this.http.get(url).toPromise();

    if (response!.result) {
      const result = response.result[0];
      this.setCache(cacheKey, result);
      return result;
    }
  }

  async getYoutubeRefreshToken() {
    if (this.isCacheValid('youtubeRefreshToken')) {
      const cached = this.getCache('youtubeRefreshToken');
      return cached.result[0].refreshToken;
    }

    let response: any = await this.http
    .get(
      `https://31xtqrng.api.sanity.io/v2022-01-12/data/query/production?query=
      *[_type == 'youtubeRefreshToken']{
        _id,
        refreshToken
      }`
    )
    .toPromise();

    if (response !== undefined) {
      this.setCache('youtubeRefreshToken', response);
      return response.result[0].refreshToken;
    }
  }

  async getTwitchAccessToken() {
    const cached = localStorage.getItem('twitchAccessToken');
    if (cached) {
      try {
        const cacheData = JSON.parse(cached);
        const now = new Date().getTime();
        if (cacheData.timestamp && (now - cacheData.timestamp) < 5 * 60 * 1000) {
          return cacheData.data;
        }
      } catch (e) {}
    }

    let response: any = await this.http
    .get(
      `https://31xtqrng.api.sanity.io/v2022-01-12/data/query/production?query=
      *[_type == 'twitchAccessToken']{
        _id,
        accessToken
      }`
    )
    .toPromise();

    if (response !== undefined) {
      const cacheData = {
        timestamp: new Date().getTime(),
        data: response.result[0]
      };
      localStorage.setItem('twitchAccessToken', JSON.stringify(cacheData));
      return response.result[0];
    }
  }

  async updateTwitchAccessToken(_id: string, newAccessToken: string) {
    const mutations = [{
      createOrReplace: {
        _id: _id,
        _type: 'twitchAccessToken',
        accessToken: `Bearer ${newAccessToken}`
      }
    }]

    fetch(`https://31xtqrng.api.sanity.io/v2022-01-12/data/mutate/production`, {
      method: 'post',
      headers: {
        'Content-type': 'application/json',
        Authorization: this.token
      },
      body: JSON.stringify({mutations})
    })
      .then(response => response.json())
      .then(result => console.log(result))
      .catch(error => console.error(error))
  }

  async getTeamMembers() {
    if (this.isCacheValid('teamMembers')) {
      console.log('Usando miembros del equipo desde caché');
      return;
    }

    console.log('Descargando miembros del equipo desde Sanity');
    
    let response: any = await this.http
      .get(
      `https://31xtqrng.api.sanity.io/v2022-01-12/data/query/production?query=
      *[_type == 'teamMember']{
        _id,
        name,
        slug,
        "imageUrl": picture.asset->url + "?w=600&h=600",
        description,
        nationality,
        age,
        role,
        team,
        "game": game->{ name, "logo": logo.asset->url + "?w=100&h=100" },
        twitch,
        instagram,
        twitter
      }`
    )
    .toPromise();

    response.result.forEach((member: any) => {
      if (member.description) {
        member.newDescription = this.convertBlockContentToHtml(member.description);
      }
    });

    if (response !== undefined) {
      this.setCache('teamMembers', response);
    }
  }

  convertBlockContentToHtml(article: any) {
    const blocksToHtml = require('@sanity/block-content-to-html');
    const h = blocksToHtml.h;

    const highlight = (props: { mark: { color: any }; children: any }) =>
      h(
        'span',
        { style: { backgroundColor: props.mark.color } },
        props.children
      );

    let content = blocksToHtml({
      blocks: article,
      serializers: { marks: { highlight } },
      projectId: '31xtqrng',
      dataset: 'production',
    });

    return content;
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


