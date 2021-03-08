import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
  }
  createLoginForm() {
    this.loginForm = this.fb.group({
      UserName: ['', Validators.required],
      password: ['', Validators.required]
    });
  }
}
