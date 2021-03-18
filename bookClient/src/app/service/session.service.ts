import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SessionService {
  access_token: string = "";
  constructor() { }

  get getAccessToken(): any {
    return this.access_token;
  }

  set setAccessToken(tokenValue: any) {
    this.access_token = tokenValue;
  }
}
