import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import SwiperCore, {
  SwiperOptions,
} from "swiper";
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-gaming',
  templateUrl: './gaming.component.html',
  styleUrls: ['./gaming.component.scss']
})
export class GamingComponent implements OnInit {

  @Input() title: string = '';
  @Input() newsList: Array<any> = [];
  index: number = 0;

  config: SwiperOptions = {
    slidesPerView: 1.20,
    spaceBetween: 15,
    breakpoints: {
      765: {
        slidesPerView: 2,
      },
      1024: {
        enabled: false,
      },
    }
  };


  constructor(private router: Router, private translate: TranslateService) {
    this.translate.setDefaultLang('es');
  }

  redirectToNoticia(slug: String) {
    // Redirige a la URL deseada al hacer clic en la tarjeta
    this.router.navigate(['../noticia/' + slug]);
  }

  ngOnInit(): void {
    const savedLang = localStorage.getItem('lang') || 'es';
    this.translate.use(savedLang); // Esto asegura que tenga el idioma correcto
    this.index = this.newsList.length - 1;
    this.newsList = this.newsList.reverse();
  }
}
