import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { HttpHelperService } from "../service/http-helper.service";
import { SessionService } from "../service/session.service";
declare var $: any;
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  showLoader: boolean = false;
  loginAlertMsg: string = '';
  loginPopupMsg: string = '';
  constructor(private fb: FormBuilder,
    public router: Router,
    public http: HttpHelperService,
    public session: SessionService) { }

  ngOnInit(): void {
    this.session.access_token = "";
    this.createLoginForm();
  }
  createLoginForm() {
    this.loginForm = this.fb.group({
      EmailID: ['', [Validators.required, Validators.pattern(/^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,10})$/)]],
      Password: ['', Validators.required]
    });
  }

  userLogin() {
    let reqData: any = { ...this.loginForm.getRawValue() };
    this.showLoader = true;
    this.http.httpPost('/userLogin', reqData, {}).subscribe((res: any) => {
      console.log("Login Response", res);
      this.showLoader = false;
      if (res.status === "SUCCESS") {
        this.session.access_token = res.jwtToken;
        this.loginAlertMsg = "";
        this.router.navigate(['booklists']);
      } else {
        if (res.custom_error) {
          this.loginAlertMsg = res.message;
        } else {
          this.loginPopupMsg = "Something went wrong. Login Failed."
          this.showModalDialog('loginDialog');
        }
      }
    });
  }

  showModalDialog(dialogModalID) {
    $(`#${dialogModalID}`).modal('show');
  }

  hideModalDialog(dialogModalID) {
    $(`#${dialogModalID}`).modal('hide');
  }

  get loginFormControls() {
    return this.loginForm.controls;
  }
}
