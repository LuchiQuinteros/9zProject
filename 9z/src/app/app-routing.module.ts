import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AboutComponent } from './about/about.component';
import { AchievementsComponent } from './achievements/achievements.component';
import { HomeComponent } from './home/home.component';
import { NewComponent } from './news/new/new.component';
import { NewsComponent } from './news/news.component';
import { OurMatchesComponent } from './our-matches/our-matches.component';
import { PlayerComponent } from './player/player.component';
import { TeamsComponent } from './teams/teams.component';
import { TeamComponent } from './teams/team/team.component';
import { NewsletterComponent } from './components/newsletter/newsletter.component';
import { PreloaderComponent } from './preloader/preloader.component';
import { VideosComponent } from './videos/videos.component';
import { AllNewsComponent } from './all-news/all-news.component';
import { ComingSoonComponent } from './components/coming-soon/coming-soon.component';
import { TermsAndConditionsComponent } from './terms-and-conditions/terms-and-conditions.component';
import { TeamDisciplineComponent } from './team-discipline/team-discipline.component';

const routes: Routes = [
  {
    path: 'inicio',
    component: HomeComponent,
    pathMatch: 'full',
    data: { animation: 'home' },
  },
  {
    path: 'jugador/:name',
    component: PlayerComponent,
    pathMatch: 'full',
    data: { animation: 'player' },
  },
  {
    path: 'noticias',
    component: NewsComponent,
    pathMatch: 'full',
    data: { animation: 'news' },
  },
  {
    path: 'nosotros',
    component: AboutComponent,
    pathMatch: 'full',
    data: { animation: 'about' },
  },
  {
    path: 'noticia/:title',
    component: NewComponent,
    pathMatch: 'full',
    data: { animation: 'new' },
  },
  {
    path: 'calendario',
    component: OurMatchesComponent,
    pathMatch: 'full',
    data: { animation: 'matches' },
  },
  {
    path: 'partidos',
    component: OurMatchesComponent,
    pathMatch: 'full',
    data: { animation: 'matches' },
  },
  {
    path: 'equipos',
    component: TeamsComponent,
    pathMatch: 'full',
    data: { animation: 'teams' },
  },
  {
    path: 'logros',
    component: AchievementsComponent,
    pathMatch: 'full',
    data: { animation: 'achievements' },
  },
  {
    path: 'disciplina/:game',
    component: TeamDisciplineComponent,
    pathMatch: 'full',
    data: { animation: 'team/:game' },
  },
  {
    path: 'equipo/:game',
    component: TeamComponent,
    pathMatch: 'full',
    data: { animation: 'team/:game' },
  },
  {
    path: 'contacto',
    component: NewsletterComponent,
    pathMatch: 'full',
    data: { animation: 'members' },
  },
  {
    path: 'videos',
    component: VideosComponent,
    pathMatch: 'full',
    data: { animation: 'videos' },
  },
  {
    path: 'all-news',
    component: AllNewsComponent,
    pathMatch: 'full',
    data: { animation: 'allnews' },
  },
  {
    path: 'coming-soon',
    component: ComingSoonComponent,
    pathMatch: 'full',
    data: { animation: 'shop' },
  },
  {
    path: 'terms/:content',
    component: TermsAndConditionsComponent,
    pathMatch: 'full',
    data: { animation: 'terms' },
  },
  {
    path: 'preloader',
    component: PreloaderComponent,
    pathMatch: 'full',
    data: { animation: 'preloader' },
  },
  {
    path: '',
    redirectTo: 'inicio',
    pathMatch: 'full',
    data: { animation: 'home' },
  },
  {
    path: '**',
    redirectTo: 'inicio',
    pathMatch: 'full',
    data: { animation: 'home' },
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      initialNavigation: 'enabled',
      scrollPositionRestoration: 'disabled',
      onSameUrlNavigation: 'reload',
      //  scrollOffset: [0,0]
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
