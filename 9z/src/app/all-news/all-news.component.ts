import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-all-news',
  templateUrl: './all-news.component.html',
  styleUrls: ['./all-news.component.scss']
})
export class AllNewsComponent implements OnInit {
  newsList: Array<any> = [];
  category: string = '';

  constructor(
    private translate: TranslateService,
    private activeRoute: ActivatedRoute
  ) {
    this.translate.setDefaultLang('es');
  }

  async ngOnInit() {
    const savedLang = localStorage.getItem('lang') || 'es';
    this.translate.use(savedLang); // Esto asegura que tenga el idioma correcto
    this.activeRoute.queryParams.subscribe(async routeParams => {
      if (routeParams.category !== undefined) {
        this.category = routeParams.category;
      }

      const jsonNews = JSON.parse(localStorage.getItem('news') || 'null');

      this.getNewsList(jsonNews);
    });
    this.listenForRipple();
  }

  getNewsList(jsonNews: any) {
    this.newsList = [];
    jsonNews.result.forEach((post: any) => {
      post.newTitle = post.title.split(' ').join('-');
    })

    this.newsList = jsonNews.result.filter((post: any) => this.category !== 'latest news' ? post.category === this.category : post)
    // for (let i = 0; i < jsonNews.result.length; i++) {
    //   jsonNews.result[i].newTitle = jsonNews.result[i].title.split(' ').join('-');
    //   if (jsonNews.result[i].category.name === this.category) {
    //     this.newsList.push(jsonNews.result[i]);
    //   }
    // }

  }

  openNew(url: string) {
    window.open(url, '_blank');
  }

  listenForRipple() {
    let btn = document.querySelector(".ripple-btn")!;

    btn.addEventListener("mouseenter", (e: any) => {
      let ripple = document.createElement("div");
      const left = e.clientX - e.target.getBoundingClientRect().left;
      const top = e.clientY - e.target.getBoundingClientRect().top;

      ripple.classList.add("ripple");
      ripple.style.left = `${left}px`;
      ripple.style.top = `${top}px`;
      btn.prepend(ripple);
    });

    btn.addEventListener("mouseleave", (e: any) => {
      let ripple = document.querySelector<HTMLElement>('.ripple')!;
      const left = e.clientX - e.target.getBoundingClientRect().left;
      const top = e.clientY - e.target.getBoundingClientRect().top;

      ripple.style.left = `${left}px`;
      ripple.style.top = `${top}px`;

      ripple.style.animation = "rippleAnimLeave 0.2s forwards";
      setTimeout(function () {
        btn.removeChild(ripple);
      }, 350);

    });
  }

}

