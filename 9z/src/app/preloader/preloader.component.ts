import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { fadeOut } from '../animations';
import { Sponsor } from '../about/about.component';
import { SanityService } from '../services/sanity.services';

@Component({
  selector: 'app-preloader',
  templateUrl: './preloader.component.html',
  styleUrls: ['./preloader.component.scss'],
  animations: [
    fadeOut
  ]
})
export class PreloaderComponent implements OnInit {
  // sponsors: Sponsor[] = [
  //   {
  //     img: "../../assets/about/Copia-de-Diggit.png",
  //     name :"Diggit"
  //   },
  //   {
  //     img: "../../assets/about/4.png",
  //     name :"Intel"
  //   },
  //   {
  //     img: ".../../assets/about/5.png",
  //     name :"Redbull"
  //   },
  //   {
  //     img: "../../assets/about/6.png",
  //     name :"Roobet",
  //     small: true
  //   },
  //   {
  //     img: "../../assets/about/Copia-de-lemon.png",
  //     name :"LemonCash",
  //     small: true
  //   },
  //   {
  //     img: "../../assets/about/Copia-de-Logitech.png",
  //     name :"Logitech"
  //   },
  //   {
  //     img: "../../assets/about/Copia-de-Shell.png",
  //     name :"Shell"
  //   },
  // ]

  sponsors: Sponsor[] = [];
  progress: any = 0;
  @Output() hidePreloader = new EventEmitter<any>();

  constructor(
    public sanitizer:DomSanitizer,
    private sanityServices: SanityService

  ) { }

  async ngOnInit() {

    await this.getSponsors()

    document.body.classList.add('noscroll');

    let loader = setInterval(()=>{

      if (this.progress < 100) {
        this.progress++
      } else {
        clearInterval(loader)
        setTimeout(()=>{
          this.hidePreloader.emit(false);
          document.body.classList.remove('noscroll');
        },400 )
      }
    }, 5);
  }

  async getSponsors() {
    const response: any = await this.sanityServices.getSponsorsByPage('Preloader')
    .catch(error => {
      console.log(error);
    });

    if (response?.logos) {
      this.sponsors = response.logos;
    }
  }
}
