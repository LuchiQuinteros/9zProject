import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SocialService } from '../services/social.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-teams',
  templateUrl: './teams.component.html',
  styleUrls: ['./teams.component.scss'],
})
export class TeamsComponent implements OnInit {
  teams: Array<any> = [
    {
      name: '',
      image: '../../assets/teams/CS2.png',
      redirect: '/disciplina/cs2',
    },
    {
      name: '',
      image: '../../assets/teams/VALO.png',
      redirect: '/disciplina/valorant',
    },
    {
      name: '',
      image: '../../assets/teams/SIM-RACING.png',
      redirect: '/equipo/SIM-RACING',
    },
    {
      name: '',
      image: '../../assets/teams/CC.png',
      redirect: '/equipo/STREAMERS',
    },
    {
     name: '',
     image: '../../assets/teams/PUBGM.png',
     redirect: '/equipo/PUBG-Mobile',
    },
    {
      name: '',
      image: '../../assets/teams/HoK.png',
      redirect: '/equipo/HONOR-OF-KINGS',
     },
     {
       name: '',
       image: '../../assets/teams/ML.png',
       redirect: '/equipo/MOBILE-LEGENDS',
      }
  ];

  constructor(private socialServices: SocialService, private router: Router,private translate: TranslateService) {
    this.translate.setDefaultLang('es');
  }

  ngOnInit(): void {
    this.socialServices.updateMetaTags('Teams');
    const savedLang = localStorage.getItem('lang') || 'es';
    this.translate.use(savedLang); // Esto asegura que tenga el idioma correcto
  }


}
