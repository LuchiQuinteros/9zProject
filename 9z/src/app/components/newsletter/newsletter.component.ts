import { Component, OnInit } from '@angular/core';
import { SanityService } from 'src/app/services/sanity.services';
import { Meta, Title } from '@angular/platform-browser';
import { SocialService } from 'src/app/services/social.service';
import { TranslateService } from '@ngx-translate/core';

interface Form {
  name: string | boolean,
  birthdate: string | boolean
  email: string | boolean,
  message: string | boolean
}

@Component({
  selector: 'app-newsletter',
  templateUrl: './newsletter.component.html',
  styleUrls: ['./newsletter.component.scss']
})
export class NewsletterComponent implements OnInit {
  style: any;
  today: Date = new Date();
  termsRead: boolean = false;
  form: Form = {
    name: '',
    birthdate: '',
    email: '',
    message: '',
  }

  formValid: Form = {
    name: true,
    birthdate: true,
    email: true,
    message: true,
  }

  constructor(
    private sanityService: SanityService,
    private socialServices: SocialService,
    private translate: TranslateService
  ) { this.translate.setDefaultLang('es'); }

  ngOnInit(): void {
    const savedLang = localStorage.getItem('lang') || 'es';
    this.translate.use(savedLang); // Esto asegura que tenga el idioma correcto
    this.socialServices.updateMetaTags('Member');
    let today = new Date().toISOString().split("T")[0];
    let datePicker = document.getElementById('birthdate')!;
    datePicker.setAttribute("max", today);
  }

  registerUser(form: any) {
    this.sanityService.registerUser(form);
    this.form = {
      name: '',
      birthdate: '',
      email: '',
      message: '',
    }
    this.termsRead = false;
  }

  validateForm(form: any) {
    this.formValid = {
      name: true,
      birthdate: true,
      email: true,
      message: true,
    }
    Object.keys(form).forEach((key: string) => {
      this.formValid[key as keyof Form] = form[key] !== ''
    });

    if (Object.keys(form).every((input: string) => form[input as keyof Form] !== '')) {
      this.registerUser(form)
    }
  }

  buttonHover(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    const rect = target.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    this.style = {
      '--x': `${x}px`,
      '--y': `${y}px`
    };
  }
}
