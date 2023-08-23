import { Component, OnInit } from '@angular/core';
import { SanityService } from 'src/app/services/sanity.services';
import { Meta, Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { SocialService } from 'src/app/services/social.service';

interface Form {
  name: string | boolean,
  birthdate: string | boolean
  email: string | boolean,
  nationality: string | boolean
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
    nationality: ''
  }

  formValid: Form = {
    name: true,
    birthdate: true,
    email: true,
    nationality: true
  }

  constructor(
    private sanityService: SanityService,
    private socialServices: SocialService
  ) { }

  ngOnInit(): void {
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
      nationality: ''
    }
    this.termsRead = false;
  }

  validateForm(form: any) {
    this.formValid = {
      name: true,
      birthdate: true,
      email: true,
      nationality: true
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
