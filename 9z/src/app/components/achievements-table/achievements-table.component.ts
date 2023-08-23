import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-achievements-table',
  templateUrl: './achievements-table.component.html',
  styleUrls: ['./achievements-table.component.scss'],
})
export class AchievementsTableComponent implements OnInit {

  @Input() achievementsList: Array<any> = [];
  @Input() quantity: number = 9;
  @Input() standalone: boolean = true;
  @Input() team: any;

  achievementsListFiltered: Array<any> = [];
  expanded: boolean = false;

  constructor(private activeRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.activeRoute.queryParams.subscribe(async routeParams => {
      if (routeParams.team || this.team) {
        this.team = routeParams.team;
        this.achievementsListFiltered = this.achievementsList.filter((match) => match.game.name.toLowerCase() === this.team)
      }
    });
    this.populateList(this.quantity);
  }

  populateList(quantity: number, filter?: false) {
    for (let i = 0; i < quantity; i++) {
      this.achievementsListFiltered.push(this.achievementsList[i]);
    }
  }

  expand(expand: boolean) {
    if (this.expanded !== expand) {
      this.expanded = expand;
      this.populateList(this.achievementsList.length);
    } else {
      this.expanded = !expand;
    }
  }
}
