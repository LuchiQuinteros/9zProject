import { Component, Input, OnInit } from '@angular/core';
import { listAnimation } from 'src/app/animations';
import { Subscription } from 'rxjs';
import { CommonService } from 'src/app/services/common.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-home-match',
  templateUrl: './home-match.component.html',
  styleUrls: ['./home-match.component.scss'],
  animations: [
    listAnimation
  ]
})
export class HomeMatchComponent implements OnInit {

  @Input() matchesToShow = 0;
  tabActive: string = 'upcoming';
  @Input()upcomingMatchesList: Array<any> = [];
  @Input()pastMatchesList: Array<any> = [];
  @Input()standalone: boolean = false;
  @Input() team: any;


  private lastMatchesSubscription: Subscription;

  constructor(
    private commonServices: CommonService,
    private activeRoute: ActivatedRoute
  ) {
    this.lastMatchesSubscription= this.commonServices.getInfoMatchesUpdate().subscribe
    (result => {
      this.pastMatchesList = result.message.pastMatchList;
      this.upcomingMatchesList = result.message.upcomingMatchList;
      this.matchesToShow = result.message.matchesToShow;
      if (this.upcomingMatchesList.length === 0) {
        this.changeTab('past')
      }
      this.ngOnInit();
    });
  }

  async ngOnInit() {
    this.activeRoute.queryParams.subscribe(async routeParams => {
      if (routeParams.team) {
        this.team = routeParams.team;
        this.pastMatchesList = this.pastMatchesList.filter((match) => match.game.name.toLowerCase() === this.team.toLowerCase())
        this.upcomingMatchesList = this.upcomingMatchesList.filter((match) => match.game.name.toLowerCase() === this.team.toLowerCase())
      }
    });
    if (this.matchesToShow !== 0) {
      this.upcomingMatchesList = this.upcomingMatchesList.slice(0, this.matchesToShow);
      this.pastMatchesList = this.pastMatchesList.slice(0, this.matchesToShow)
    }
    if (this.upcomingMatchesList.length === 0) {
      this.changeTab('past')
    }
  }

  changeTab(tab: string) {
    this.tabActive = tab;
  }


}
