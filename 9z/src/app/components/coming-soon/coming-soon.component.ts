import { Component, OnInit } from '@angular/core';
import { Sponsor } from 'src/app/about/about.component';

@Component({
  selector: 'app-coming-soon',
  templateUrl: './coming-soon.component.html',
  styleUrls: ['./coming-soon.component.scss']
})
export class ComingSoonComponent implements OnInit {
  sponsors: Sponsor[] = [
    {
      logo: "../../assets/about/Copia-de-Diggit.png",
      name :"Diggit"
    },
    {
      logo: "../../assets/about/4.png",
      name :"Intel"
    },
    {
      logo: ".../../assets/about/5.png",
      name :"Redbull"
    },
    {
      logo: "../../assets/about/6.png",
      name :"Roobet",
    },
    {
      logo: "../../assets/about/Copia-de-lemon.png",
      name :"LemonCash",
    },
    {
      logo: "../../assets/about/Copia-de-Logitech.png",
      name :"Logitech"
    },
    {
      logo: "../../assets/about/Copia-de-Shell.png",
      name :"Shell"
    },
  ]

  constructor() { }

  ngOnInit(): void {
  }

}
