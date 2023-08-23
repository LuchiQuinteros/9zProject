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
      name: 'cs main',
      image: '../../assets/teams/CS-MAIN.jpg',
      redirect: '/equipo/csgo-main',
    },
    {
      name: 'cs academy',
      image: '../../assets/teams/CS-AC.jpg',
      redirect: '/equipo/csgo-academy',
    },

    {
      name: 'sim racing',
      image: '../../assets/teams/Sim-Racing.jpg',
      redirect: '/equipo/sim-racing',
    },

    {
      name: 'valorant',
      image: '../../assets/teams/Valorant.jpg',
      redirect: '/equipo/valorant',
    },
    {
      name: 'valorant femenino',
      image: '../../assets/teams/Valorant-FEM.jpg',
      redirect: '/equipo/valorant-fem',
    },
  ];

  constructor(private socialServices: SocialService, private router: Router) {}

  ngOnInit(): void {
    this.socialServices.updateMetaTags('Teams');
  }


}
