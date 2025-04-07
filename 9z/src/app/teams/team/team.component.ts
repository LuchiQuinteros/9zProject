import { Component, Input, OnInit, HostListener  } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { listAnimation } from 'src/app/animations';
import { SanityService } from 'src/app/services/sanity.services';
import { SocialService } from 'src/app/services/social.service';
import { TVComponent } from 'src/app/tv/tv.component';
import { SwiperOptions } from 'swiper';


@Component({
  selector: 'app-team',
  templateUrl: './team.component.html',
  styleUrls: ['./team.component.scss'],
  animations: [
    listAnimation
  ]
})

export class TeamComponent implements OnInit {
  @Input() matchesToShow = 0;
  tabActive: string = '';
  hr: any = {
    width: 65,
    margin: 0
  }
  images: any;
  upcomingMatchList: Array<any> = [];
  pastMatchList: Array<any> = [];
  achievementsList: Array<any> = [];
  teams: Array<any> = [
    {
      name: 'CS2-MAIN',
      image: '../../../assets/teams/cs2-main.png',
      imageMb: '../../../assets/teams/cs2-main.png',
    },
    {
      name: 'CS2-ACADEMY',
      image: '../../../assets/teams/cs2-ac.png',
      imageMb: '../../../assets/teams/cs2-ac.png',
    },

    {
      name: 'SIM-RACING',
      image: '../../../assets/teams/SIM-RACING.png',
      imageMb: '../../../assets/teams/SIM-RACING.png',
    },

    {
      name: 'VALORANT-MASC',
      image: '../../../assets/teams/valo-main.png',
      imageMb: '../../../assets/teams/valo-main.png',
    },
    {
      name: 'VALORANT-FEM',
      image: '../../../assets/teams/VALO-FEM.png',
      imageMb: '../../../assets/teams/VALO-FEM.png',
    },
    {
      name: 'STREAMERS',
      image: '../../assets/teams/CC.png',
      redirect: '/equipo/STREAMERS',
    },
    {
      name: 'PUBG-Mobile',
      image: '../../../assets/teams/PUBGM.png',
      imageMb: '../../../assets/teams/PUBGM.png',
    },
    {
      name: 'Honor of Kings',
      image: '../../../assets/teams/PUBGM.png',
      imageMb: '../../../assets/teams/PUBGM.png',
    },
  ];

  background: any;
  sliderCards: Array<any> = [];
  players: Array<any> = [];
  coachs: Array<any> = [];
  managers: Array<any> = [];
  ambassadors: Array<any> = [];
  youtubeVideosList: Array<any> = [];
  game: string = '';
  team: string = 'main';

  playerSlide: SwiperOptions = {
    slidesPerView: 1.2,
    spaceBetween: 30,
    centeredSlides: false,
    centerInsufficientSlides: true,
    breakpoints: {

      765: {
        slidesPerView: 2.5,
        centeredSlides: false,
      }

    }
  };
  public getScreenWidth: any;
  public getScreenHeight: any;

  constructor(
    private tvComponent: TVComponent,
    private sanityServices: SanityService,
    private socialServices: SocialService,
    private activeRoute: ActivatedRoute,
    private router: Router
  ) { }

  async ngOnInit() {
    this.getScreenWidth = window.innerWidth;
      this.getScreenHeight = window.innerHeight;
    this.activeRoute.params.subscribe(async routeParams => {
      let data: any = routeParams.game;
      this.getBackground(data);
      this.getGame(data);
      data = data.split('-').join(' ');
      this.socialServices.updateMetaTags(this.capitalize(data));

      const teamMembers = JSON.parse(localStorage.getItem('teamMembers')!);
      const matches = JSON.parse(localStorage.getItem('matches')!);
      const achievements = JSON.parse(localStorage.getItem('achievements')!);

      if (!teamMembers || !matches || !achievements) {
        await this.sanityServices.getTeams();

        await this.sanityServices.getTeamMembers();
        await this.sanityServices.getMatches();
        await this.sanityServices.getAchievements();

        setTimeout(async () => {
          const teamMembers = JSON.parse(localStorage.getItem('teamMembers')!);
          const matches = JSON.parse(localStorage.getItem('matches')!);
          const achievements = JSON.parse(localStorage.getItem('achievements')!);
          this.getDataCards(teamMembers);
          this.getMatches(matches);
          this.getAchievements(achievements);
          await this.getYoutubeVideos();

          if (this.game === 'pubg mobile') {
            this.changeTab(document.getElementById('coach'));
          } else {
            this.changeTab(document.getElementById('player'));
          }

          if(this.game === 'streamers') {
            this.changeTab(document.getElementById('streamers'));
          }
        }, 850);

      } else {
        this.getDataCards(teamMembers);
        this.getMatches(matches);
        this.getAchievements(achievements);
        await this.getYoutubeVideos();

        if (this.game === 'pubg mobile') {
          this.changeTab(document.getElementById('coach'));
        } else {
          this.changeTab(document.getElementById('coach'));
          this.changeTab(document.getElementById('player'));
        }

        if(this.game === 'streamers') {
          this.changeTab(document.getElementById('streamers'));
        }
      }

    });

    this.hr.width = document.getElementById('player')?.clientWidth;
    this.changeTab(document.getElementById('player'));

    if(this.game === 'streamers') {
      this.changeTab(document.getElementById('streamers'));
    }
  }

  @HostListener('window:resize', ['$event'])
  onWindowResize() {
    this.getScreenWidth = window.innerWidth;
    this.getScreenHeight = window.innerHeight;
  }

  getGame(data: string) {
    this.team = 'main';
    if (data !== undefined) {
      if (data === 'CS2-MAIN') {
        this.game = 'cs2';
        this.team = 'main';
      } else if (data === 'CS2-ACADEMY') {
        this.game = 'cs2';
        this.team = 'academy';
      } else if (data === 'VALORANT-MASC') {
        this.game = 'valorant';
        this.team = 'main';
      } else if (data === 'VALORANT-FEM') {
        this.game = 'valorant-fem';
        this.team = 'main';
      } else if (data === 'STREAMERS') {
        this.game = 'streamers';
      } else if (data === 'SIM-RACING') {
        this.game = 'sim-racing';
        this.team = 'main';
      } else if (data === 'HONOR-OF-KINGS') {
        this.game = 'honor-of-kings';
        this.team = 'main';
      } else {
        this.game = data.replace('-', ' ');
      }
    }
  }

  async getYoutubeVideos() {
    const localYoutubeVideos = JSON.parse(localStorage.getItem('youtubeVideoList') || 'null');

    if (localYoutubeVideos !== undefined && localYoutubeVideos !== null && localYoutubeVideos !== 'null') {
      this.youtubeVideosList = localYoutubeVideos;
    } else {
      await this.tvComponent.getYoutubePlaylistVideos();
      setTimeout(async() => {
        const localYoutubeVideos = JSON.parse(localStorage.getItem('youtubeVideoList') || 'null');

        if (localYoutubeVideos !== undefined && localYoutubeVideos !== null && localYoutubeVideos !== 'null') {
          this.youtubeVideosList = localYoutubeVideos;
        }
      }, 800);
    }
  }


  getBackground(teamName: any) {
    let url = 'url('
    for(let team of this.teams) {
      if(team.name === teamName) {
        this.background = url + team.image + ')';
        if(this.getScreenWidth < 765) {
          this.background = url + team.imageMb + ')';
        }
        return ;
      }
    }
  }
  getDataCards(data: any) {
    console.log(data);
    this.players = [];
    this.coachs = [];
    this.managers = [];
    this.ambassadors = [];
    this.ambassadors = data.result.filter((card: any) => card.game.name === 'streamers' && this.game === 'streamers');
    this.ambassadors = this.ambassadors.map((card: any) => {
      if (card.slug === 'Frankkaster') {
        return { ...card, role: 'Streamer & CEO' }; // Crea un nuevo objeto con el valor modificado
      } else {
        return { ...card, role: 'Streamer' }; // Cr
      }
    });
    this.players = data.result.filter((player: any) => {
      console.log(this.game);
      if (player.game && player.game?.name.toLowerCase() === this.game.toLowerCase()) {
        if (player.role === 'player' || player.role === 'runner') {
          if (this.team === 'main' && player.team === 'main' || this.team === 'academy' && player.team === 'academy') {
            return player
         }
       }
      }
    })
    this.coachs = data.result.filter((coach: any) => {
      if (coach.game && coach.game?.name.toLowerCase() === this.game.toLowerCase()) {
        if (coach.role === 'coach' || coach.role === 'headCoach' || coach.role === 'analyst') {
          if ((this.team === 'main' && coach.team === 'main') || (this.team === 'academy' && coach.team === 'academy')) {
            return coach
          }
        }
    }})
    this.managers = data.result.filter((manager: any) => manager.role === 'manager')
    // for (let i = 0; i < data.result.length; i++) {

    //   if (data.result[i].role === 'ambassador') {
    //     this.ambassadors.push(data.result[i]);
    //   }

    //   if ((data.result[i].game !== null) && (data.result[i].game.name.toLocaleLowerCase() === this.game.toLocaleLowerCase())) {

    //     switch (data.result[i].role) {
    //       case 'player':
    //       case 'runner': {
    //         if (this.team === 'main' && data.result[i].team === 'main') {
    //           this.players.push(data.result[i]);
    //         } else if (this.team === 'academy' && data.result[i].team === 'academy') {
    //           this.players.push(data.result[i]);
    //         }
    //         break;
    //       }

    //       case 'coach':
    //       case 'headCoach':
    //       case 'analyst':
    //          {
    //           if (this.team === 'main' && data.result[i].team === 'main') {
    //             this.coachs.push(data.result[i]);
    //           }
    //        else if (this.team === 'academy' && data.result[i].team === 'academy') {
    //           this.coachs.push(data.result[i]);
    //         }
    //         break;
    //       }

    //       case 'manager': {
    //         this.managers.push(data.result[i]);
    //         break;
    //       }
    //     }
    //   }
    // }
  }

  capitalize(string: any) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  getMatches(matches: any) {
    this.upcomingMatchList = [];
    this.pastMatchList = [];
    matches.result.forEach((match: any) => {
      if (match.game && match.game?.name.toLowerCase() === this.game.toLowerCase()) {
        if (match.game.name.toLowerCase() === 'fortnite') {
          if (!match.position && !match.teamMember) {
            this.upcomingMatchList.push(match)
          } else {
            this.pastMatchList.push(match)
          }
        } else if (match.result === '0' && match.result2 === '0') {
          this.upcomingMatchList.push(match)
        } else {
          this.pastMatchList.push(match)
        }
      }
    });
    // for (let i = 0; i < matches.result.length; i++) {
    //   if ((matches.result[i].game !== null) && (matches.result[i].game.name.toLocaleLowerCase() === this.game)) {
    //     if (matches.result[i].game.name.toLocaleLowerCase() === 'fortnite') {
    //       if (matches.result[i].position === null && matches.result[i].teamMember === null) {
    //         this.upcomingMatchList.push(matches.result[i]);
    //       } else {
    //         this.pastMatchList.push(matches.result[i]);
    //       }
    //     } else {
    //       if (matches.result[i].result1 === '0' && matches.result[i].result2 === '0') {
    //         this.upcomingMatchList.push(matches.result[i]);
    //       } else {
    //         this.pastMatchList.push(matches.result[i]);
    //       }
    //     }
    //   }
    // }
  }

  getAchievements(achievements: any) {
    this.achievementsList = [];
    achievements.result.forEach((match: any) => {
      if (match.game && this.game === 'cs2') {
        if (this.team === 'main' && match.game.name.toLowerCase() === 'cs2') {
          this.achievementsList.push(match)
        } else if (match.game.name === 'cs2-academy') {
          this.achievementsList.push(match)
        }
      } else if (match.game && match.game.name.toLowerCase() === this.game.toLowerCase()) {
        this.achievementsList.push(match)
      }
    })
    // for (let i = 0; i < achievements.result.length; i++) {
    //   if (achievements.result[i].game !== null) {
    //     switch (this.game) {
    //       case 'cs go': {
    //         if (this.team === 'main') {
    //           if (achievements.result[i].game.name.toLowerCase() === 'cs go') {
    //             this.achievementsList.push(achievements.result[i]);
    //           }
    //         } else {
    //           if (achievements.result[i].game.name.toLowerCase() === 'cs:go academy') {
    //             this.achievementsList.push(achievements.result[i]);
    //           }
    //         }
    //         break;
    //       }

    //       // case 'fortnite': {
    //       //   break;
    //       // }

    //       default: {
    //         if (achievements.result[i].game.name.toLowerCase() === this.game) {
    //           this.achievementsList.push(achievements.result[i]);
    //         }
    //       }
    //     }
    //   }
    //   // if ((achievements.result[i].game !== null) && (achievements.result[i].game.name.toLocaleLowerCase() === this.game)) {
    //   //   this.achievementsList.push(achievements.result[i]);
    //   // }
    // }
  }

  changeTab(target : any) {
    console.log(target.id);
    let tab = target.id;
    this.hr.width = target.clientWidth;
    this.hr.margin = target.offsetLeft;


    if (this.tabActive !== tab) {
      this.tabActive = tab;
      this.sliderCards = [];

      switch(tab) {
        case 'player': {
          this.sliderCards = this.players;
          break;
        }

        case 'coach': {
          this.sliderCards = this.coachs;
          break;
        }

        case 'manager': {
          this.sliderCards = this.managers;
          break;
        }

        case 'streamers': {
          this.sliderCards = this.ambassadors;
          break;
        }
      }
    }
  }
}