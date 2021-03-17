import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Subject } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class HttpHelperService {

  constructor(private http: HttpClient) { }

  httpPost(url: string, body: any, options?: any) {
    options.headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJVc2VyTmFtZSI6IkFkbWluIiwiQXBwIjoiYWRtaW4iLCJSb2xlIjoiQURNSU4iLCJzZXNzaW9uSUQiOiJTRVNTSU9OLWNhY2YxMDdlLWRiZTktNDBjNi04Njk0LTEwZDM3ZmVhZmJlOSIsImlhdCI6MTU5NzgzMTM3OCwiZXhwIjoxNTk3OTE3Nzc4fQ.JQ4h2Bw0nOqcmKWUXUjywlzljMQtSj9VrNwIxzkGmeY'
    });
    let reqBody: any = { data: body };
    url = `http://localhost:3000${url}`;
    return this.http.post(url, reqBody, options);
  }
}
