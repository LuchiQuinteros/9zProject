import { Component, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {

  languages = [
    { value: 'es', label: 'Español', flag: 'assets/flags/ar.svg' },
    { value: 'en', label: 'English',  flag: 'assets/flags/gb.svg' },
    { value: 'pt', label: 'Português', flag: 'assets/flags/br.svg' }
  ];

  selectedLang = this.languages[0];
  showDropdown = false;

  @Input() hideHeader: boolean = false;
  @Output() activeMenu = new EventEmitter<any>();
  lastScroll = 0;

  constructor(private translate: TranslateService) {
    const savedLang = localStorage.getItem('lang') || 'es';
    this.translate.setDefaultLang(savedLang);
    this.translate.use(savedLang);
  }

  ngOnInit() {
    const savedLang = localStorage.getItem('lang') || 'es';
    const foundLang = this.languages.find(l => l.value === savedLang);
    if (foundLang) {
      this.selectedLang = foundLang;
      this.translate.use(foundLang.value);
    }
  }

  toggleDropdown() {
    this.showDropdown = !this.showDropdown;
  }

  setLanguage(lang: { value: string, label: string, flag: string }) {
    this.selectedLang = lang;
    this.showDropdown = false;

    this.translate.use(lang.value);
    localStorage.setItem('lang', lang.value);
  }

  triggerMenu() {
    document.body.classList.add('noscroll');
    this.activeMenu.emit(true);
    this.hideHeader = true;
  }
}
