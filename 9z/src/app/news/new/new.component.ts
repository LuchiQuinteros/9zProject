import { Component, OnInit } from '@angular/core';
import { EnvironmentVariablesService } from 'src/app/services/environment-variables.service';
import { SanityService } from 'src/app/services/sanity.services';
import { SocialService } from 'src/app/services/social.service';

@Component({
  selector: 'app-new',
  templateUrl: './new.component.html',
  styleUrls: ['./new.component.scss'],
})
export class NewComponent implements OnInit {
  new: any = '';
  featuredNewsList: Array<any> = [];
  category1NewsList: Array<any> = [];
  category2NewsList: Array<any> = [];
  category1: string = '';
  category2: string = '';
  url: string = '';
  constructor(
    private sanityServices: SanityService,
    private socialServices: SocialService,
    private environmentServices: EnvironmentVariablesService
  ) {}

  async ngOnInit() {
    let title = decodeURI(window.location.href);
    title = title.split(`/noticia/`).pop()!;
    // TODO: cambiar url cuando se publique
    this.url = `${this.environmentServices.netlifyUrl}/noticia/${title}`;
    // title = title.split('-').join(' ');
    this.socialServices.updateMetaTags(this.capitalize(title));
    const jsonNews = JSON.parse(localStorage.getItem('news')!);
    if (!jsonNews) {
      await this.sanityServices.getNews();

      setTimeout(async () => {
        const jsonNews = JSON.parse(localStorage.getItem('news')!);
        console.log(jsonNews)
        this.new = jsonNews.result.find((post: any) => post.slug === title)
        this.getNewLists(jsonNews);
        // for (let i = 0; i < jsonNews.result.length; i++) {
        //   if (title === jsonNews.result[i].title) {
        //     this.new = jsonNews.result[i];
        //   }
        // }
      }, 1200);
    } else {
      this.getNewLists(jsonNews);
      this.new = jsonNews.result.find((post: any) => post.slug === title)
    }
  }

  capitalize(string: any) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  async getNewLists(news: any) {
    const jsonShownCategories = JSON.parse(
      localStorage.getItem('shownCategories')!
    );

    if (!jsonShownCategories) {
      setTimeout(async () => {
        const jsonShownCategories = JSON.parse(
          localStorage.getItem('shownCategories')!
        );
        this.category1 = jsonShownCategories.result[0].category1;
        this.category2 = jsonShownCategories.result[0].category2;
        this.category1NewsList = [];
        this.category2NewsList = [];
        this.featuredNewsList = await this.getFeaturedNews();
        news.result.forEach((post: any) => {
          post.newTitle = post.title.split(' ').join('-');
          post.slug = this.getName(post.title)

          if (post.category) {
            if (post.category === this.category1) {
              this.category1NewsList.push(post)
            } else if (post.category === this.category2) {
              this.category2NewsList.push(post)
            }
          }
        })
      }, 1200);
    } else {
      this.category1 = jsonShownCategories.result[0].category1;
      this.category2 = jsonShownCategories.result[0].category2;
      this.category1NewsList = [];
      this.category2NewsList = [];
      this.featuredNewsList = await this.getFeaturedNews();
      news.result.forEach((post: any) => {
        post.newTitle = post.title.split(' ').join('-');
        post.slug = this.getName(post.title)
        if (post.category) {
          if (post.category === this.category1) {
            this.category1NewsList.push(post)
          } else if (post.category === this.category2) {
            this.category2NewsList.push(post)
          }
        }
      })
    }
  }

  async getFeaturedNews() {
    const response: any = await this.sanityServices.getPageNews()
    .catch(error => {
      console.log(error);
    });

    if (response) {
      console.log(response)
      response.featuredNews.forEach((post: any) => post.slug = this.getName(post.title))
      return response.featuredNews;
    }
  }

  refreshNew() {
    setTimeout(async () => {
      await this.ngOnInit();
    }, 500);
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
