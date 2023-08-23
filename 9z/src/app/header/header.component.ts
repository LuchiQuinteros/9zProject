import { Component, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  @Input() hideHeader: boolean = false;
  @Output() activeMenu = new EventEmitter<any>();
  lastScroll = 0;
  constructor() { }

  ngOnInit(): void {

  }
  // scrollbar.addListener(({ offset }) => {
  //   console.log(offset)
  // });
  // @HostListener('window:scroll', ['$event']) onScrollEvent($event: any){

  // }

  triggerMenu() {
    document.body.classList.add('noscroll');
    this.activeMenu.emit(true);
    this.hideHeader = true;
  }

}
