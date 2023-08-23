import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { SanityService } from '../services/sanity.services';

@Component({
  selector: 'app-terms-and-conditions',
  templateUrl: './terms-and-conditions.component.html',
  styleUrls: ['./terms-and-conditions.component.scss']
})
export class TermsAndConditionsComponent implements OnInit {

  content: any = {
    title: '',
    data: '',
  };

  constructor(
    private activeRoute: ActivatedRoute,
    private sanityServices: SanityService,
    private router: Router
    ) {
      router.events.subscribe(async (val) => {
        if (val instanceof NavigationEnd) {
          await this.getContent(this.activeRoute.snapshot.params.content)
        }
    });
  }

  async ngOnInit() {
    await this.getContent(this.activeRoute.snapshot.params.content);
  }

  async getContent(content: string) {
    const response: any = await this.sanityServices.getLegal(content)
    .catch(error => {
      console.log(error);
    });

    if (response) {
      this.content.data = response.content;
    }

    switch (content) {
      case 'termsAndConditions':
        this.content.title = 'Terminos y Condiciones';
        break;

      case 'privacyPolicy':
        this.content.title = 'Politicas de Privacidad';
        break;

      case 'fanContentPolicy':
        this.content.title = 'Terminos y Condiciones del Fan';
        break;

      default:
        break;
    }
  }
}
