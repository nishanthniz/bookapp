import { Component, OnInit } from '@angular/core';
import { SessionService } from "../service/session.service";
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  constructor(public session: SessionService) { }

  ngOnInit(): void {
  }
}
