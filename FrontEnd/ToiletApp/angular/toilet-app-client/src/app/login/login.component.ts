import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { LoginModel } from '../_models/loginModel';
import { TokenModel } from '../_models/tokenModel';
import { FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  router: Router
  http: HttpClient
  snackBar: MatSnackBar
  loginModel: LoginModel

  userName: FormControl
  password: FormControl

  constructor(http: HttpClient, snackBar: MatSnackBar, router: Router) {
    this.snackBar = snackBar
    this.http = http
    this.router = router
    this.loginModel = new LoginModel()
    this.password = new FormControl(
      '', [Validators.required,  Validators.minLength(3), Validators.maxLength(15)])
    this.userName = new FormControl(
      '', [Validators.required, Validators.minLength(3), Validators.maxLength(15)])
  }

  public sendLoginCredentials() : void {
    this.http
    .post<TokenModel>('http://localhost:5200/Auth/Login', this.loginModel)
    .subscribe(
      (success) => {
        
        localStorage.setItem('uid', success.uid)
        localStorage.setItem('token', success.token)
        localStorage.setItem('token-expiration', success.expiration.toString())
        this.router.navigate(['/home'])
      },
      (error) => {
        this.snackBar.open('Login failed, please ty again.', 'Close', { duration: 5000 })
      })
  }

  get formInvalid(): boolean {
    return (
      this.userName.invalid ||
      this.password.invalid
    );
  }

  getNameErrorMessage() : string {
    if (this.userName.hasError('required')) {
      return 'You must enter a value!';
    }

    if(this.userName.hasError('minlength')) {
      return this.userName.hasError('minlength') ? 'Minimum lenght is 3 character!' : '';
    }
    else {
      return this.userName.hasError('maxlength') ? 'Maximum lenght is 15 character!' : '';
    }
  }

  getPwErrorMessage() : string {
    if (this.userName.hasError('required')) {
      return 'You must enter a value!';
    }

    if(this.userName.hasError('minlength')) {
      return this.userName.hasError('minlength') ? 'Minimum lenght is 6 character!' : '';
    }
    else {
      return this.userName.hasError('maxlength') ? 'Maximum lenght is 15 character!' : '';
    }
  }

  public checkInputs() : boolean {
    return this.loginModel.userName !== '' && this.loginModel.password !== ''
  }
}