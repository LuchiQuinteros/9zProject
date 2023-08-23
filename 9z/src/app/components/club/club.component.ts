import { Component, Input, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-club',
  templateUrl: './club.component.html',
  styleUrls: ['./club.component.scss'],
})
export class ClubComponent implements OnInit {
  private clubSubscription: Subscription;

  @Input() popularNews: Array<any> = [];
  mostPopularNew: any = null;

  constructor(private commonServices: CommonService) {
    this.clubSubscription = this.commonServices
      .getfeaturedNewsListClubUpdate()
      .subscribe((result) => {
        this.popularNews = result.message;
      });
  }

  ngOnInit(): void {
    if (this.popularNews.length > 0) {
      this.mostPopularNew = this.popularNews[0];
    }

  }

}
