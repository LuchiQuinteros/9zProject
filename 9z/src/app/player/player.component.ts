import { AfterViewInit, Component, OnInit } from '@angular/core';
import { SanityService } from '../services/sanity.services';
import { APP_BASE_HREF } from '@angular/common';
import { SocialService } from '../services/social.service';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-player',
  providers: [{ provide: APP_BASE_HREF, useValue: '/player/' }],
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.scss'],
})
export class PlayerComponent implements OnInit, AfterViewInit {
  data: string = '';
  player: any = null;
  players: any = null;
  listPlayers: Array<any> = [];
  newsList: Array<any> = [];
  upcomingMatchList: Array<any> = [];
  pastMatchList: Array<any> = [];
  achievementsList: Array<any> = [];
  youtubeVideosList: Array<any> = [];
  team: string = '';
  constructor(
    private sanityServices: SanityService,
    private socialServices: SocialService,
    private router: Router,
    private activeRoute: ActivatedRoute,
  ) {
      router.events.subscribe(async (val) => {
        if (val instanceof NavigationEnd) {
          if (this.activeRoute.snapshot.params.name) {
            this.data = this.activeRoute.snapshot.params.name;
            this.getParams();
            this.socialServices.updateMetaTags(this.capitalize(this.data));
          }
        }
    });
  }

  async ngOnInit() {
    let data = window.location.href.split('/jugador/').pop();
    if (data) {
      this.data = data;
      this.getParams()
    }

    this.socialServices.updateMetaTags(this.capitalize(this.data));
  }

  async getParams() {
    this.players = JSON.parse(localStorage.getItem('teamMembers')!);

    if (!this.players) {
      await this.sanityServices.getCategories();
      await this.sanityServices.getTeams();
      await this.sanityServices.getTeamMembers();
      await this.sanityServices.getNews();
      await this.sanityServices.getMatches();
      await this.sanityServices.getAchievements();

      setTimeout(() => {
        this.players = JSON.parse(localStorage.getItem('teamMembers')!);
        this.getPlayer();
        this.newsList = [];
        this.getDataByPlayer(this.player);
      }, 500);
    } else {
      this.getPlayer();
      this.newsList = [];
      this.getDataByPlayer(this.player);
    }
  }

  async getPlayer() {
    this.player = this.players.result.find((player: any) => player.slug === this.data)
    this.listPlayers = [];
    this.players.result.forEach((player: any) => {
      console.log(player);
      if(player.role === "ambassador") {
        player.role = "STREAMER";
        if(player.slug === "Frankkaster") {
          player.role = "STREAMER & CEO";
        }
      }
      if (player.game?.name === this.player.game?.name && player.team === this.player.team) {
        player.redirect = `/jugador/${player.slug}`
        player.image = player.imageUrl
        if (player.name !== this.player.name) {
          this.listPlayers.push(player)
        }
      }
    })
    this.team = this.player.game?.name.toLowerCase();
  }

  async getDataByPlayer(player: any) {
    let jsonNews = JSON.parse(localStorage.getItem('news') || 'null');
    const jsonMatches = JSON.parse(localStorage.getItem('matches') || 'null');
    const jsonAchievements = JSON.parse(
      localStorage.getItem('achievements') || 'null'
    );
    jsonNews.result.forEach((post: any) => {
      if (post.teamMember && post.teamMember._ref === player._id) {
        post.newTitle = post.title.split(' ').join('-');
        this.newsList.push(post)
      }
    })
    // for (let i = 0; i < jsonNews.result.length; i++) {
    //   if (
    //     jsonNews.result[i].teamMember !== null &&
    //     jsonNews.result[i].teamMember._ref === player._id
    //   ) {
    //     jsonNews.result[i].newTitle = jsonNews.result[i].title
    //       .split(' ')
    //       .join('-');
    //     this.newsList.push(jsonNews.result[i]);
    //   }
    // }

    if (player.game) {
      jsonMatches.result.forEach((match: any) => {
        if (match.game && match.game.name === player.game.name) {
          if (match.game.name.toLowerCase() === 'fortnite') {
            if (!match.position && !match.teamMember) {
              this.upcomingMatchList.push(match)
            } else {
              this.pastMatchList.push(match)
            }
          } else if (match.result1 === '0' && match.result2 === '0') {
            this.upcomingMatchList.push(match)
          } else {
            this.pastMatchList.push(match)
          }
        }
      })
      // for (let i = 0; i < jsonMatches.result.length; i++) {
      //   if (
      //     jsonMatches.result[i].game !== null &&
      //     jsonMatches.result[i].game.name === player.game.name
      //   ) {
      //     if (
      //       jsonMatches.result[i].game.name.toLocaleLowerCase() === 'fortnite'
      //     ) {
      //       if (
      //         jsonMatches.result[i].position === null &&
      //         jsonMatches.result[i].teamMember === null
      //       ) {
      //         this.upcomingMatchList.push(jsonMatches.result[i]);
      //       } else {
      //         this.pastMatchList.push(jsonMatches.result[i]);
      //       }
      //     } else {
      //       if (
      //         jsonMatches.result[i].result1 === '0' &&
      //         jsonMatches.result[i].result2 === '0'
      //       ) {
      //         this.upcomingMatchList.push(jsonMatches.result[i]);
      //       } else {
      //         this.pastMatchList.push(jsonMatches.result[i]);
      //       }
      //     }
      //   }
      // }
      if (jsonAchievements?.result) {
        this.achievementsList = jsonAchievements.result.filter((achievement: any) => achievement?.game.name === player.game.name)
      }
    }
    this.checkNick()
  }

  checkNick() {
    const nick = document.getElementById('playerNick')!;
    console.log(this.player)
    if (nick) {
      if (nick.scrollWidth > nick.clientWidth) {
        let fontSize = parseInt(window.getComputedStyle(nick).fontSize);
        fontSize = fontSize - 28;
        nick.style.fontSize = fontSize + 'px'
        nick.style.overflow = 'unset';
        nick.style.lineBreak = 'anywhere'
      }
    }
  }

  capitalize(string: any) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  openLink(url: any) {
    let finalUrl = 'https://' + url;
    window.open(finalUrl, '_blank')
  }
  ngAfterViewInit(): void {
    this.checkNick()

  }
}
