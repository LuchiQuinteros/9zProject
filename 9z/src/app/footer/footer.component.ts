import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

export interface Link {
  name: string,
  url: string,
  image?: string,
}

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {

  teams: Link[] = [
    {
      name: "CS:GO Main",
      url: "./equipo/csgo-main"
    },
    {
      name: "CS:GO Academy",
      url: "./equipo/csgo-academy"
    },
    {
      name: "Sim Racing",
      url: "./equipo/sim-racing"
    },
    {
      name: "Valorant",
      url: "./equipo/valorant"
    },
    {
      name: "Valorant Fem",
      url: "./equipo/valorant-fem"
    }
  ];
  footerLinks: Link[] = [
    {
      name: "Contacto",
      url: './contacto'
    },
    {
      name: "Términos y condiciones",
      url: '../terms/termsAndConditions'
    },
    {
      name: "Políticas de privacidad",
      url: '../terms/privacyPolicy'
    }
  ]
  constructor(private translate: TranslateService)
  {
    this.translate.setDefaultLang('es');
  }

  ngOnInit(): void {
    const savedLang = localStorage.getItem('lang') || 'es';
    this.translate.use(savedLang); // Esto asegura que tenga el idioma correcto
  }
}
