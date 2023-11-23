import {Component, EventEmitter, HostListener, Input, OnInit, Output  } from '@angular/core';
import { SanityService } from '../services/sanity.services';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sponsor-footer',
  templateUrl: './sponsor-footer.component.html',
  styleUrls: ['./sponsor-footer.component.scss'],
})
export class SponsorFooterComponent implements OnInit {
  @Input() hideHeader: boolean = false;
  @Output() activeMenu = new EventEmitter<any>();
  lastScroll = 0;
  sponsors: any[] = [];
  
  constructor(
    private sanityServices: SanityService,
  ) {}

  async ngOnInit() {
    await this.getSponsors();
    this.listenForRipple();
  }

  triggerMenu() {
    document.body.classList.add('noscroll');
    this.activeMenu.emit(true);
    this.hideHeader = true;
  }

  listenForRipple() {
    let btn = document.querySelector(".ripple-btn")!;

    //btn.addEventListener("mouseenter", (e: any) => {
    //  let ripple = document.createElement("div");
    //  const left = e.clientX - e.target.getBoundingClientRect().left;
    //  const top = e.clientY - e.target.getBoundingClientRect().top;

    //  ripple.classList.add("ripple");
    //  ripple.style.left = `${left}px`;
    //  ripple.style.top = `${top}px`;
    //  btn.prepend(ripple);
    //});

    //btn.addEventListener("mouseleave", (e: any) => {
    //  let ripple = document.querySelector<HTMLElement>('.ripple')!;
    //  const left = e.clientX - e.target.getBoundingClientRect().left;
    //  const top = e.clientY - e.target.getBoundingClientRect().top;
    //  ripple.style.left = `${left}px`;
    //  ripple.style.top = `${top}px`;

    //  ripple.style.animation = "rippleAnimLeave 0.2s forwards";
    //  setTimeout(function() {
    //      btn.removeChild(ripple);
    //  }, 350);

   // });
  }

  async getSponsors() {
    const response: any = await this.sanityServices.getSponsorsByPage('Inicio')
    .catch(error => {
      console.log(error);
    });

    if (response?.logos) {
      this.sponsors = response.logos;
    }
  } 
}