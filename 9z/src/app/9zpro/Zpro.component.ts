import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
    selector: 'app-Zpro',
    templateUrl: './Zpro.component.html',
    styleUrls: ['./Zpro.component.scss']
})
export class NinezPro implements OnInit {

    selectedCategory: string = 'mouse';

    CardInfo = [
        {
            title: "Teclado Ghost Blanco",
            url: 'https://drive.google.com/file/d/13G-kRKCcfTq1OG3avuwp1Ew-MBqfqjNk/view?usp=sharing',
            img: '../../assets/media/k-ghost-w.webp',
            category: 'keyboard'
        },
        {
            title: "Teclado Ghost Negro",
            url: 'https://drive.google.com/file/d/13G-kRKCcfTq1OG3avuwp1Ew-MBqfqjNk/view?usp=sharing',
            img: '../../assets/media/k-ghost.webp',
            category: 'keyboard'
        },
        {
            title: "Teclado Ghoul Blanco",
            url: 'https://drive.google.com/file/d/1JIvAxvAFOvcEyuCjj5jzGOPWKVNI_yDK/view?usp=sharing',
            img: '../../assets/media/k-ghoul.webp',
            category: 'keyboard'
        },
        {
            title: "Mouse 9Z Shade Lite Negro",
            url: 'https://drive.google.com/file/d/1ceQXsfTa6bBdxOXqOzR5Jbu1S8d1UpRm/view?usp=sharing',
            img: '../../assets/media/m-shade-lite.webp',
            category: 'mouse'
        },
        {
            title: "Mouse 9Z Shade Pro Negro",
            url: 'https://drive.google.com/file/d/1oHTKQ4lIxv8tfNC9ThhzqpAvdR47BKMp/view?usp=sharing',
            img: '../../assets/media/m-shade-n.webp',
            category: 'mouse'
        },
        {
            title: "Mouse 9Z Spectre Violeta",
            url: 'https://drive.google.com/file/d/11n-lbnsGlghN0a1tR6KcioGvOIKJ-1hr/view?usp=sharing',
            img: '../../assets/media/m-spectre-v.webp',
            category: 'mouse'
        },
    ];

    Cats: { img: SafeHtml; name: string }[] = [];

    constructor(
        private translate: TranslateService,
        private sanitizer: DomSanitizer
    ) {
        this.translate.setDefaultLang('es');

        this.Cats = [
            {
                img: this.sanitizer.bypassSecurityTrustHtml(`
                    <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24">
                        <g fill="none" stroke="currentColor" stroke-linejoin="round" stroke-width="2">
                        <path d="M6 9a6 6 0 0 1 12 0v6a6 6 0 0 1-12 0z" />
                        <path stroke-linecap="round" d="M12 7v4" />
                        </g>
                    </svg>
                `),
                name: 'mouse'
            },
            {
                img: this.sanitizer.bypassSecurityTrustHtml(`
                    <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24"><path fill="currentColor" d="M4.616 18q-.691 0-1.153-.462T3 16.384V7.616q0-.691.463-1.153T4.615 6h14.77q.69 0 1.152.463T21 7.616v8.769q0 .69-.463 1.153T19.385 18zm0-1h14.769q.23 0 .423-.192t.192-.424V7.616q0-.231-.192-.424T19.385 7H4.615q-.23 0-.423.192T4 7.616v8.769q0 .23.192.423t.423.192M9 15.77h6q.31 0 .54-.221q.23-.22.23-.549q0-.31-.23-.54t-.54-.23H9q-.31 0-.54.221q-.23.22-.23.549q0 .31.23.54t.54.23M4 17V7zm2-7.23q.31 0 .54-.23T6.77 9t-.23-.54T6 8.23t-.54.23t-.23.54t.23.54t.54.23m3 0q.31 0 .54-.23T9.77 9t-.23-.54T9 8.23t-.54.23t-.23.54t.23.54t.54.23m3 0q.31 0 .54-.23t.23-.54t-.23-.54t-.54-.23t-.54.23t-.23.54t.23.54t.54.23m3 0q.31 0 .54-.23t.23-.54t-.23-.54t-.54-.23t-.54.23t-.23.54t.23.54t.54.23m3 0q.31 0 .54-.23t.23-.54t-.23-.54t-.54-.23t-.54.23t-.23.54t.23.54t.54.23m-12 3q.31 0 .54-.23t.23-.54t-.23-.54t-.54-.23t-.54.23t-.23.54t.23.54t.54.23m3 0q.31 0 .54-.23t.23-.54t-.23-.54t-.54-.23t-.54.23t-.23.54t.23.54t.54.23m3 0q.31 0 .54-.23t.23-.54t-.23-.54t-.54-.23t-.54.23t-.23.54t.23.54t.54.23m3 0q.31 0 .54-.23t.23-.54t-.23-.54t-.54-.23t-.54.23t-.23.54t.23.54t.54.23m3 0q.31 0 .54-.23t.23-.54t-.23-.54t-.54-.23t-.54.23t-.23.54t.23.54t.54.23"/></svg>
                `),
                name: 'keyboard'
            }
        ];
    }

    ngOnInit(): void {
        const savedLang = localStorage.getItem('lang') || 'es';
        this.translate.use(savedLang);
    }

    setCategory(cat: string): void {
        this.selectedCategory = cat;
    }

    get filteredCards() {
        return this.CardInfo.filter(item => item.category === this.selectedCategory);
    }
}
