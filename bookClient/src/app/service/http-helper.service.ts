import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { SessionService } from "./session.service";

@Injectable({
  providedIn: 'root'
})
export class HttpHelperService {

  constructor(private http: HttpClient, public session: SessionService) { }

  httpPost(url: string, body: any, options?: any) {
    options.headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.session.getAccessToken()}`
    });
    let reqBody: any = { data: body };
    url = `http://localhost:3000${url}`;
    return this.http.post(url, reqBody, options);
  }
}
