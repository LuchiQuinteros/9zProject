import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { fadeAnimation } from 'src/app/animations';
import { Link } from 'src/app/footer/footer.component';
import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
  animations: [
    fadeAnimation
  ]
})

export class SidebarComponent implements OnInit {

  @Input() activeMenu = false;
  @Output() openCloseMenu = new EventEmitter<any>();
  expanded: string = '';
  teams: Link[] = [
    {
      name: "todos",
      url: "/equipos"
    },
    {
      name: "CS:GO",
      url: "./equipo/csgo"
    },
    {
      name: "Valorant",
      url: "./equipo/valorant"
    },
    {
      name: "Sim Racing",
      url: "./equipo/sim-racing"
    },
    {
      name: "Streamers",
      url: "./equipo/streamers"
    },
    {
      name: "PUBG Mobile",
      url: "./equipo/PUBG-Mobile"
    },
    {
      name: "Honor of Kings",
      url: "./equipo/HONOR-OF-KINGS"
    },
    {
      name: "Mobile Legends",
      url: "./equipo/MOBILE-LEGENDS"
    }
  ];
  constructor(private translate: TranslateService) {
    this.translate.setDefaultLang('es');
  }

  ngOnInit(): void {
    const savedLang = localStorage.getItem('lang') || 'es';
    this.translate.use(savedLang); // Esto asegura que tenga el idioma correcto
  }

  triggerMenu() {
    if (this.activeMenu) {
      this.openCloseMenu.emit(false);
      this.activeMenu = false;
      const main = document.getElementById('main');
      document.body.classList.remove('noscroll');
      if (main) main.classList.remove('noscroll')
    } else {
      this.openCloseMenu.emit(true);
      this.activeMenu = true;
      document.body.classList.add('noscroll');
      const main = document.getElementById('main');
      if (main) main.classList.add('noscroll')

    }
  }

  expand(tab: string) {
    if (this.expanded !== tab) {
      this.expanded = tab;
    } else {
      this.expanded = '';
    }
  }
}
