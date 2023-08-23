import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { fadeAnimation } from 'src/app/animations';
import { Link } from 'src/app/footer/footer.component';
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
      name: "CS:GO Main",
      url: "./equipo/csgo-main"
    },
    {
      name: "CS:GO Academy",
      url: "./equipo/csgo-academy"
    },
    {
      name: "Sim Racing",
      url: "./equipo/sim-racing"
    },
    {
      name: "Valorant",
      url: "./equipo/valorant"
    },
    {
      name: "Valorant Fem",
      url: "./equipo/valorant-fem"
    }
  ];
  constructor() { }

  ngOnInit(): void {
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
