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

  constructor(
    private http: HttpClient,
  ) {}

  async registerUser(form: any) {

    const member = {
      _type: 'member',
      name: form.name,
      birthdate: form.birthdate,
      email: form.email,
      nationality: form.nationality,
    }

    // const result = await client.create(member);

    // console.log(result);

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
    let response: any = await this.http
    .get(
      `https://31xtqrng.api.sanity.io/v2022-01-12/data/query/production?query=*[_type == 'news']{
        date,
        "coverImageUrl": cover_image.asset->url,
        title,
        subtitle,
        subheader,
        resume,
        content,
        urlNew,
        readingTime,
        isFeaturedNew,
        "category": category->title,
        "game": game->{ name, "logo": logo.asset->url },
        teamMember
      }
      `
    )
    .toPromise();

    // const query = `*[_type == 'news']{
    //   date,
    //   "coverImageUrl": cover_image.asset->url,
    //   title,
    //   subtitle,
    //   subheader,
    //   resume,
    //   content,
    //   urlNew,
    //   readingTime,
    //   isFeaturedNew,
    //   isBannerNew,
    //   isHeroNew,
    //   "category": categoryNews->title,
    //   "game": game->{ name, logo },
    //   teamMember
    // }`;

    // let response = await client.fetch(query)

    response.result.forEach((post: any) => {
      var dateMomentObject = moment(post.date, 'DD/MM/YYYY');
      post.newDate = dateMomentObject.toDate();
      if (post.title) {
        post.slug = this.getName(post.title);
      }
      if (post.coverImageUrl) {
        post.coverImageUrl += '?auto=format'
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

      localStorage.setItem('news', JSON.stringify(response));
    }
  }

  async getGames() {
    let response: any = await this.http
    .get(
      `https://31xtqrng.api.sanity.io/v2022-01-12/data/query/production?query=
      *[_type == 'game']{
        _id,
        name,
        "logoImageUrl": logo.asset->url
      }`
    )
    .toPromise();

    // const query = `*[_type == 'game']{
    //   _id,
    //   name,
    //   "logoImageUrl": logo.asset->url
    // }`;

    // let response = await client.fetch(query);

    response.result.forEach((game: any) => {
      if (game.logoImageUrl) {
        game.logoImageUrl += '?auto=format'
      }
    })

    if (response?.result) {
      return response.result;
    }
  }

  async getTeams() {
    let response: any = await this.http
    .get(
      `https://31xtqrng.api.sanity.io/v2022-01-12/data/query/production?query=
      *[_type == 'team']{
        _id,
        name,
        "logoImageUrl": logo.asset->url
      }`
    )
    .toPromise();

    // const query = `*[_type == 'team']{
    //   _id,
    //   name,
    //   "logoImageUrl": logo.asset->url
    // }`;

    // let response = await client.fetch(query);

    response.result.forEach((game: any) => {
      if (game.logoImageUrl) {
        game.logoImageUrl += '?auto=format'
      }
    })


    if (response !== undefined) {
      localStorage.setItem('teams', JSON.stringify(response));
    }
  }

  async getCategories() {
    let response: any = await this.http
    .get(
      `https://31xtqrng.api.sanity.io/v2022-01-12/data/query/production?query=
      *[_type == 'categoryNews']{
        _id,
        title,
      }`
    )
    .toPromise();

    // const query = `*[_type == 'categoryNews']{
    //   _id,
    //   title,
    // }`;

    // let response = await client.fetch(query);

    if (response !== undefined) {
      localStorage.setItem('categories', JSON.stringify(response));
    }
  }

  async getMatches() {
    let response: any = await this.http
    .get(
      `https://31xtqrng.api.sanity.io/v2022-01-12/data/query/production?query=
      *[_type == 'match']{
        date,
        time,
        tournament,
        "team1": team1->{ name, "logo": logo.asset->url },
        "team2": team2->{ name, "logo": logo.asset->url },
        "game": game->{ name, "logo": logo.asset->url },
        result1,
        result2,
        "teamMember": teamMember->slug,
        position,
        streamUrl,
      }`
    )
    .toPromise();

    // const query = `*[_type == 'match']{
    //   date,
    //   time,
    //   tournament,
    //   "team1": team->{ name, logo },
    //   "team2": team->{ name, logo },
    //   "game": game->{ name, logo },
    //   result1,
    //   result2,
    //   "teamMember": teamMember->slug,
    //   position,
    //   streamUrl,
    // }`;

    // let response = await client.fetch(query);

    response.result.forEach((match: any) => {
      var dateMomentObject = moment(match.date, 'DD/MM/YYYY');
      match.newDate = dateMomentObject.toDate()
    })

    if (response !== undefined) {
      response.result.sort((a: any, b: any) => a.newDate - b.newDate).reverse();
      localStorage.setItem('matches', JSON.stringify(response));
    }
  }

  async getAchievements() {
    let response: any = await this.http
    .get(
      `https://31xtqrng.api.sanity.io/v2022-01-12/data/query/production?query=
      *[_type == 'achievement']{
        date,
        position,
        tournament,
        "game": game->{ name, "logo": logo.asset->url }
      }`
    )
    .toPromise();

    // const query = `*[_type == 'achievement']{
    //   date,
    //   position,
    //   tournament,
    //   "game": game->{ name, logo }
    // }`;

    // let response = await client.fetch(query);

    response.result.forEach((achievement: any) => {
      var dateMomentObject = moment(achievement.date, 'DD/MM/YYYY');
      achievement.newDate = dateMomentObject.toDate()
    })

    if (response !== undefined) {
      localStorage.setItem('achievements', JSON.stringify(response));
    }
  }

  async getShownCategories() {
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

    // const query = `*[_type == 'shownCategories']{
    //   "category1": categoryNews->title,
    //   "category2": categoryNews->title,
    //   "category3": categoryNews->title
    // }`;

    // let response = await client.fetch(query);

    if (response !== undefined) {
      localStorage.setItem('shownCategories', JSON.stringify(response));
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
    let response: any = await this.http
    .get(
      `https://31xtqrng.api.sanity.io/v2022-01-12/data/query/production?query=
      *[_type == 'streamers']{
        username,
      }`
    )
    .toPromise();

    if (response?.result) {
      return response?.result;
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
    let response: any = await this.http
    .get(
      `https://31xtqrng.api.sanity.io/v2022-01-12/data/query/production?query=
      *[_type == 'videoGallery'] | order(_createdAt){
        title,
        layout,
        "videos": videos[]{
          title,
          tag,
          "preview": preview.asset->url,
          url
        },
      }`
    )
    .toPromise();

    if (response!.result) {
      return response.result.reverse();
    }
  }

  async getHome() {
    let response: any = await this.http
    .get(
      `https://31xtqrng.api.sanity.io/v2022-01-12/data/query/production?query=
      *[_type == 'home']{
        title,
        "imageHero": heroImage.asset->url,
        "imageHeroMob": heroImageMob.asset->url,
        titleCTA,
        localRedirect,
        urlCTA
      }`
    )
    .toPromise();

    if (response!.result) {
      return response.result[0];
    }
  }

  async getPageNews() {
    let response: any = await this.http
    .get(
      `https://31xtqrng.api.sanity.io/v2022-01-12/data/query/production?query=
      *[_type == 'pageNews']{
        "imageHero": heroImage.asset->url,
        "heroNews": heroNews[]->{
          date,
          "coverImageUrl": cover_image.asset->url,
          title,
          subtitle,
          urlNew,
        },
        "featuredNews": featuredNews[]->{
          date,
          "coverImageUrl": cover_image.asset->url,
          title,
          readingTime,
          urlNew,
          resume,
        },
        "bannerNew": bannerNew->{
          date,
          "coverImageUrl": cover_image.asset->url,
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
      return response.result[0];
    }
  }

  async getSponsorsByPage(page: string) {
    const queryUrl: string = 'https://31xtqrng.api.sanity.io/v2021-10-21/data/query/production?query=';
    const query: string = `*[_type == 'sponsors' && pageName == '${page}']{
      pageName,
      "logos": logos[]{
        name,
        "logo": logo.asset->url
      }
    }`;
    const url = `${queryUrl}${encodeURIComponent(query)}`

    let response: any = await this.http.get(url).toPromise();

    if (response!.result) {
      return response.result[0];
    }
  }

  async getYoutubeRefreshToken() {
    let response: any = await this.http
    .get(
      `https://31xtqrng.api.sanity.io/v2022-01-12/data/query/production?query=
      *[_type == 'youtubeRefreshToken']{
        _id,
        refreshToken
      }`
    )
    .toPromise();

    // const query = `*[_type == 'youtubeRefreshToken']{
    //   _id,
    //   refreshToken
    // }`;

    // let response = await client.fetch(query);

    if (response !== undefined) {
      localStorage.setItem('youtubeRefreshToken', JSON.stringify(response));
      return response.result[0].refreshToken;
    }
  }

  async getTwitchAccessToken() {
    let response: any = await this.http
    .get(
      `https://31xtqrng.api.sanity.io/v2022-01-12/data/query/production?query=
      *[_type == 'twitchAccessToken']{
        _id,
        accessToken
      }`
    )
    .toPromise();

    // const query = `*[_type == 'twitchAccessToken']{
    //   _id,
    //   accessToken
    // }`;

    // let response = await client.fetch(query);

    if (response !== undefined) {
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
    let response: any = await this.http
      .get(
      `https://31xtqrng.api.sanity.io/v2022-01-12/data/query/production?query=
      *[_type == 'teamMember']{
        _id,
        name,
        slug,
        "imageUrl": picture.asset->url,
        description,
        nationality,
        age,
        role,
        team,
        "game": game->{ name, "logo": logo.asset->url },
        twitch,
        instagram,
        twitter
      }`
    )
    .toPromise();

    // const query = `*[_type == 'teamMember']{
    //   _id,
    //   name,
    //   slug,
    //   "imageUrl": picture.asset->url,
    //   description,
    //   nationality,
    //   age,
    //   role,
    //   "team": team->{ name, logo },
    //   "game": game->{ name, logo },
    //   twitch,
    //   instagram,
    //   twitter
    // }`;

    // let response = await client.fetch(query);


    response.result.forEach((member: any) => {
      if (member.description) {
        member.newDescription = this.convertBlockContentToHtml(member.description);
      }

      if (member.imageUrl) {
        member.imageUrl += '?auto=format'
      }
    });

    // for (let i = 0; i < response.result.length; i++) {
    //   if (response.result[i].description !== null) {
    //     response.result[i].newDescription = this.convertBlockContentToHtml(
    //       response.result[i].description
    //     );
    //   }

    //   // if (response.result[i].imageUrl) {
    //   //   response.result[i].imageUrl += '?auto=format';
    //   // }
    // }

    if (response !== undefined) {
      localStorage.setItem('teamMembers', JSON.stringify(response));
    }
  }

  convertBlockContentToHtml(article: any) {
    const blocksToHtml = require('@sanity/block-content-to-html');

    // `h` is a way to build HTML known as hyperscript
    // See https://github.com/hyperhype/hyperscript for more info
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


