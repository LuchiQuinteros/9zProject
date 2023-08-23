import { Component, OnInit } from '@angular/core';
import { listAnimation } from 'src/app/animations';

@Component({
  selector: 'app-our-matches',
  templateUrl: './our-matches.component.html',
  styleUrls: ['./our-matches.component.scss'],
  animations: [
    listAnimation
  ]

})
export class OurMatchesComponent implements OnInit {

  tabActive: string = 'upcoming';
  upcomingMatchList: Array<any> = [];
  pastMatchList: Array<any> = [];

  constructor() { }

  async ngOnInit() {
    const json = JSON.parse(localStorage.getItem('matches') || '{}');
    json.result.forEach((match: any) => {
      if (match.game.name.toLowerCase() === 'fortnite') {
        if (!match.position && !match.teamMember) {
          this.upcomingMatchList.push(match)
        } else {
          this.pastMatchList.push(match)
        }
      } else if (match.result1 === '0' && match.result2 === '0'){
        this.upcomingMatchList.push(match)
      } else {
        this.pastMatchList.push(match)
      }
    });

  }

}
