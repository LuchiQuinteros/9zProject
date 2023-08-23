import { Injectable } from '@angular/core';

import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class EnvironmentVariablesService {
  constructor() {}

  get production(): boolean {
    return environment.production;
  }
  
  get netlifyUrl(): string {
    return environment.netlifyUrl;
  }

}
