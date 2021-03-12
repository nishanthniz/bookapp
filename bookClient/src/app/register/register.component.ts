import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from "@angular/forms";
import { HttpHelperService } from "../service/http-helper.service";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  registerationForm: FormGroup;
  strengthSuccess: Boolean = false;
  strengthMedium: Boolean = false;
  strengthWeak: Boolean = true;
  constructor(private fb: FormBuilder, private http: HttpHelperService) { }

  ngOnInit(): void {
    this.createRegisterationForm();
  }
  createRegisterationForm() {
    this.registerationForm = this.fb.group({
      // FullName: ['', Validators.required],
      UserName: ['', [Validators.required, Validators.pattern(/^([A-Za-z0-9_])+$/)]],
      EmailID: ['', [Validators.required, Validators.pattern(/^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,10})$/)]],
      // MobileNo: ['', Validators.required, Validators.pattern(/^((\\+91-?)|0)?[0-9]{10}$/)],
      PasswordGroup: this.fb.group({
        Password: ['', [Validators.required, Validators.pattern(/^(?=.*[0-9])(?=.*[!@#$%^&*_-])[a-zA-Z0-9!@#$%^&*_-]{6,16}$/)]],
        ConfirmPassword: ['', [Validators.required, Validators.pattern(/^(?=.*[0-9])(?=.*[!@#$%^&*_-])[a-zA-Z0-9!@#$%^&*_-]{6,16}$/)]]
      }, {
        validator: this.MatchBothPasswords
      })
    });
  }

  MatchBothPasswords(AC: AbstractControl) {
    if (AC.get('Password').value !== AC.get('ConfirmPassword').value) {
      AC.get('ConfirmPassword').setErrors({ PasswordNotMatched: true });
    } else {
      return null;
    }
  }

  checkPasswordStrength(inputPassword) {
    let password_strength_ele: any = document.getElementById('password_strength');
    let password_strength_bar: any = document.getElementsByClassName('progress-bar')[0];
    //TextBox left blank.
    if (inputPassword.length == 0) {
      password_strength_ele.innerHTML = "";
      return;
    }
    let strongPwdRegex: RegExp = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/;
    let mediumPwdRegex: RegExp = /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.{6,})/;
    let weakPwdRegex: RegExp = /^(?=.*[a-zA-Z])(?=.{2,})/;
    //Regular Expressions.
    let arrRegex: Array<RegExp> = new Array();
    arrRegex.push(weakPwdRegex); //Weak Regex
    arrRegex.push(mediumPwdRegex); //Medium Regex
    arrRegex.push(strongPwdRegex); //Strong regex
    var regPassed = 0;
    // Validate for each Regular Expression.
    for (let intReg = 0; intReg < arrRegex.length; intReg++) {
      if (new RegExp(arrRegex[intReg]).test(inputPassword)) {
        regPassed++;
      }
    }
    //Validate for length of Password.
    if (regPassed > 1 && inputPassword.length >= 8) {
      if (regPassed === 3) {
        return;
      }
      regPassed++;
    }
    // Display strength status
    var color = "";
    var strength = "";
    switch (regPassed) {
      case 0:
        password_strength_bar.style.width = '0%';
        this.strengthSuccess = false;
        this.strengthMedium = false;
        this.strengthWeak = false;
      case 1:
        password_strength_bar.style.width = "10%";
        this.strengthSuccess = false;
        this.strengthMedium = false;
        this.strengthWeak = true;
        strength = "Weak";
        color = "red";
        break;
      case 2:
        password_strength_bar.style.width = "50%";
        this.strengthSuccess = false;
        this.strengthMedium = true;
        this.strengthWeak = false;
        strength = "Medium";
        color = "green";
        break;
      case 3:
        password_strength_bar.style.width = "100%";
        this.strengthSuccess = true;
        this.strengthMedium = false;
        this.strengthWeak = false;
        strength = "Strong";
        color = "darkgreen";
        break;
    }
    password_strength_ele.innerHTML = strength;
    password_strength_ele.style.color = color;
  }

  get RegFormControls(): any {
    return this.registerationForm.controls;
  }

  get passwordControls(): any {
    return this.registerationForm.get('PasswordGroup')['controls'];
  }

  resetRegForm() {
    this.registerationForm.reset();
  }

}
