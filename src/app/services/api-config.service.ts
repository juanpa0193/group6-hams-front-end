import { Injectable } from '@angular/core';
import { environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiConfigService {

  private baseUrl = environment.apiUrl;

  constructor() { }

  getBaseUrl() {
    return this.baseUrl;
  }
}
