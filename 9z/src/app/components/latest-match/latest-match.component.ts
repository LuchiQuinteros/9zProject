import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { listAnimation } from 'src/app/animations';
import { Subscription } from 'rxjs';
import { CommonService } from 'src/app/services/common.service';
import { ActivatedRoute } from '@angular/router';
import { ModalFilterComponent } from 'src/app/modal-filter/modal-filter.component';

@Component({
  selector: 'app-latest-match',
  templateUrl: './latest-match.component.html',
  styleUrls: ['./latest-match.component.scss'],
  animations: [
    listAnimation
  ]
})
export class LatestMatchComponent implements OnInit {

  @Input() matchesToShow = 0;
  tabActive: string = 'upcoming';
  @Input()upcomingMatchesList: Array<any> = [];
  @Input()pastMatchesList: Array<any> = [];
  @Input()originalLastMatches: Array<any> = [];
  @Input()originalNextMatches: Array<any> = [];
  @Input()standalone: boolean = false;
  @Input() team: any;
  options = {
    'teams': [
      {
        label: 'CSGO Main',
        value: 1,
        checked: false,
      },
      {
        label: 'CSGO Academy',
        value: 2,
        checked: false,
      },
      {
        label: 'Valorant Main',
        value: 3,
        checked: false,
      },
      {
        label: 'Valorant Fem',
        value: 4,
        checked: false,
      }
    ],
    'disciplines': [
      {
        label: 'CSGO',
        value: 10,
        checked: false,
      },
      {
        label: 'Valorant',
        value: 11,
        checked: false,
      },
      {
        label: 'Sim Racing',
        value: 12,
        checked: false,
      },
      {
        label: 'Fortnite',
        value: 13,
        checked: false,
      },
    ]
};

  private lastMatchesSubscription: Subscription;

  constructor(
    private commonServices: CommonService,
    private activeRoute: ActivatedRoute,
    private dialog: MatDialog
  ) {
    this.lastMatchesSubscription= this.commonServices.getInfoMatchesUpdate().subscribe
    (result => {
      this.pastMatchesList = result.message.pastMatchList;
      this.upcomingMatchesList = result.message.upcomingMatchList;
      this.matchesToShow = result.message.matchesToShow;
      if (this.upcomingMatchesList.length === 0) {
        this.changeTab('past')
      }
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
      this.originalLastMatches = this.pastMatchesList;
      this.originalNextMatches = this.upcomingMatchesList;
    }
    if (this.upcomingMatchesList.length === 0) {
      this.changeTab('past')
    }
  }

  openModal() {
    console.log(this.options);
    const dialog = this.dialog.open(ModalFilterComponent, {
      width: '50%',
      minHeight: '40%',
      minWidth: '50%',
      data: {
        title: 'Filtrar',
        body: 'Podes elegir que ver y que no',
        options: this.options,
      },
      panelClass: 'filter'
    });

    dialog.afterClosed().subscribe(options => {
      if (options != undefined) {
        console.log(options);
        this.pastMatchesList = this.originalLastMatches;
        this.upcomingMatchesList = this.originalNextMatches;

        console.log(this.pastMatchesList);
        if (options.disciplines.some((discipline: {checked: boolean}) => discipline.checked)) {
          this.pastMatchesList = this.pastMatchesList.filter(match =>
            options.disciplines.some((discipline: { label: string, checked: boolean }) =>
              discipline.checked && discipline.label === match.game.name
            )
          );
        }
        console.log(this.pastMatchesList);

        if (options.teams.some((discipline: {checked: boolean}) => discipline.checked)) {
          console.log('entre');
          this.pastMatchesList = this.pastMatchesList.filter(match =>
            options.teams.some((discipline: { label: string, checked: boolean }) =>
              discipline.checked && discipline.label === match.team1.name
            )
          );
        }
        console.log(this.pastMatchesList);

        if (options.disciplines.some((discipline: {checked: boolean}) => discipline.checked)) {
          this.upcomingMatchesList = this.upcomingMatchesList.filter(match =>
            options.disciplines.some((discipline: { label: string, checked: boolean }) =>
              discipline.checked && discipline.label === match.game.name
            )
          );
        }

        if (options.teams.some((discipline: {checked: boolean}) => discipline.checked)) {
          this.upcomingMatchesList = this.upcomingMatchesList.filter(match =>
            options.teams.some((discipline: { label: string, checked: boolean }) =>
              discipline.checked && discipline.label === match.team1.name
            )
          );
        }

        this.options = options;
      } else {
      }
    });
  }

  changeTab(tab: string) {
    this.tabActive = tab;
  }
}
