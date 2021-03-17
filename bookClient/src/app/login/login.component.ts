import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { HttpHelperService } from "../service/http-helper.service";
declare var $: any;
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  loginAlertMsg: string = '';
  loginPopupMsg: string = '';
  constructor(private fb: FormBuilder,
    public http: HttpHelperService) { }

  ngOnInit(): void {
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
    this.http.httpPost('/userLogin', reqData, {}).subscribe((res: any) => {
      console.log("Login Response", res);
      if (res.status === "SUCCESS") {
        this.loginAlertMsg = "";
        this.loginPopupMsg = res.message;
      } else {
        if (res.custom_error) {
          this.loginAlertMsg = res.message;
        } else {
          this.loginPopupMsg = "Something went wrong. Login Failed."
        }
      }
      if (!this.loginAlertMsg) {
        this.showModalDialog('loginDialog');
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
