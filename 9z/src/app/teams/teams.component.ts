import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SocialService } from '../services/social.service';

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
    //{
    //  name: 'cs academy',
    //  image: '../../assets/teams/CS-AC.jpg',
    //  redirect: '/equipo/csgo-academy',
    //},
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
  ];

  constructor(private socialServices: SocialService, private router: Router) {}

  ngOnInit(): void {
    this.socialServices.updateMetaTags('Teams');
  }


}
