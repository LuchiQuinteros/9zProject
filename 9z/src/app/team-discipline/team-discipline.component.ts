import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SocialService } from '../services/social.service';

@Component({
  selector: 'app-team-discipline',
  templateUrl: './team-discipline.component.html',
  styleUrls: ['./team-discipline.component.scss']
})
export class TeamDisciplineComponent implements OnInit {
  teams: Array<any> = [];
  teamsCsgo: Array<any> = [
    {
      name: 'CS 2 MAIN',
      image: '../../assets/teams/cs2-main.png',
      redirect: '/equipo/CS2-MAIN',
    },
    {
      name: 'CS 2 ACADEMY',
      image: '../../assets/teams/cs2-ac.png',
      redirect: '/equipo/CS2-ACADEMY',
    },
  ];

  teamsValorant: Array<any> = [
    {
      name: 'Valorant Masculino',
      image: '../../assets/teams/valo-main.png',
      redirect: '/equipo/VALORANT-MASC',
    },
    // {
    //   name: 'PUBG Mobile',
    //   image: '../../assets/teams/VALO-FEM.png',
    //   redirect: '/equipo/PUBG-Mobile',
    // },
  ];

  teamStreamers: Array<any> = [
    {
      name: 'Streamers',
      image: '../../assets/teams/CC.png',
      redirect: '/equipo/STREAMERS',
    },
  ];

  teamSimRacing: Array<any> = [
    {
      name: 'Sim Racing',
      image: '../../assets/teams/SIM-RACING.png',
      redirect: '/equipo/SIM-RACING',
    },
  ];

  teamPUBGMobile: Array<any> = [
    {
      name: 'PUBG Mobile',
      image: '../../assets/teams/PUBGM.png',
      redirect: '/equipo/PUBG-Mobile',
    },
  ];

  constructor(private socialServices: SocialService, private router: Router) {
    const pathFragment = this.router.url
    if(pathFragment == '/disciplina/cs2') {
      this.teams = this.teamsCsgo;
    }

    if(pathFragment == '/disciplina/sim-racing') {
      this.teams = this.teamSimRacing;
    }

    if(pathFragment == '/disciplina/valorant') {
      this.teams = this.teamsValorant;
    }

    if(pathFragment == '/disciplina/streamers') {
      this.teams = this.teamStreamers;
    }
    
    if(pathFragment == '/disciplina/streamers') {
      this.teams = this.teamPUBGMobile;
    }

  }

  ngOnInit(): void {
    this.socialServices.updateMetaTags('Teams');
  }


}
