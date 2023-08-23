import { Component, OnInit } from '@angular/core';
import { SanityService } from '../services/sanity.services';

@Component({
  selector: 'app-achievements',
  templateUrl: './achievements.component.html',
  styleUrls: ['./achievements.component.scss']
})
export class AchievementsComponent implements OnInit {

  achievementsList: Array<any> = [];

  constructor(
    private sanityServices: SanityService
  ) { }

  async ngOnInit() {
    const achievements = JSON.parse(localStorage.getItem('achievements')!);


    if (!achievements) {
      
      await this.sanityServices.getAchievements();
      
      setTimeout(async () => {
        const achievements = JSON.parse(localStorage.getItem('achievements')!);

        this.achievementsList = achievements;
        
      }, 850);
      
    } else {
      this.achievementsList = achievements.result;
    }
  }

    scrollIntoView(id: string) {
    let element = document.getElementById(id);

    element?.scrollIntoView({
      behavior: 'smooth', block: 'nearest'
    });
  }

}
