import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { LocationStrategy, PathLocationStrategy } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SwiperModule } from 'swiper/angular';
import { ShareButtonsModule } from 'ngx-sharebuttons/buttons';
import { ShareIconsModule } from 'ngx-sharebuttons/icons';
import { AppComponent } from './app.component';
import { PlayerComponent } from './player/player.component';
import { HeaderComponent } from './header/header.component';
import { LatestMatchComponent } from './components/latest-match/latest-match.component';
import { TeamCardsComponent } from './components/team-cards/team-cards.component';
import { FooterComponent } from './footer/footer.component';
import { NewsComponent } from './news/news.component';
import { AboutComponent } from './about/about.component';
import { HomeComponent } from './home/home.component';
import { ColumnSliderComponent } from './components/column-slider/column-slider.component';
import { NewComponent } from './news/new/new.component';
import { TVComponent } from './tv/tv.component';
import { GamingComponent } from './components/gaming/gaming.component';
import { OurMatchesComponent } from './our-matches/our-matches.component';
import { AchievementsComponent } from './achievements/achievements.component';
import { Configuration } from './configuration';
import { GridSlidesComponent } from './components/grid-slides/grid-slides.component';
import { TwitchGridSlideComponent } from './components/twitch-grid-slide/twitch-grid-slide.component';
import { ClubComponent } from './components/club/club.component';
import { TwitterFeedComponent } from './components/twitter-feed/twitter-feed.component';
import { YoutubeFeedComponent } from './components/youtube-feed/youtube-feed.component';
import { VideoSlidesComponent } from './components/video-slides/video-slides.component';
import { TvGridSlidesComponent } from './components/tv-grid-slides/tv-grid-slides.component';
import { TeamsComponent } from './teams/teams.component';
import { AchievementsTableComponent } from './components/achievements-table/achievements-table.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { TeamComponent } from './teams/team/team.component';
import { NewsletterComponent } from './components/newsletter/newsletter.component';
import { ScullyLibModule } from '@scullyio/ng-lib';
import { PreloaderComponent } from './preloader/preloader.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { VideosComponent } from './videos/videos.component';
import { AllNewsComponent } from './all-news/all-news.component';
import { ComingSoonComponent } from './components/coming-soon/coming-soon.component';
import { TermsAndConditionsComponent } from './terms-and-conditions/terms-and-conditions.component';

@NgModule({
  declarations: [
    AppComponent,
    PlayerComponent,
    HeaderComponent,
    LatestMatchComponent,
    TeamCardsComponent,
    FooterComponent,
    NewsComponent,
    AboutComponent,
    HomeComponent,
    ColumnSliderComponent,
    NewComponent,
    TVComponent,
    GamingComponent,
    OurMatchesComponent,
    AchievementsComponent,
    GridSlidesComponent,
    TwitchGridSlideComponent,
    ClubComponent,
    TwitterFeedComponent,
    YoutubeFeedComponent,
    VideoSlidesComponent,
    TvGridSlidesComponent,
    TeamsComponent,
    AchievementsTableComponent,
    SidebarComponent,
    TeamComponent,
    NewsletterComponent,
    PreloaderComponent,
    VideosComponent,
    AllNewsComponent,
    ComingSoonComponent,
    TermsAndConditionsComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    SwiperModule,
    ShareButtonsModule,
    ShareIconsModule,
    ScullyLibModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [
    Configuration,
    TVComponent,
    Location, {provide: LocationStrategy, useClass: PathLocationStrategy}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
