import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { RegisterModel } from '../_models/registermodel';
import { FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-update-user',
  templateUrl: './update-user.component.html',
  styleUrls: ['./update-user.component.scss']
})
export class UpdateUserComponent implements OnInit {
  http: HttpClient
  router: Router
  user: RegisterModel
  snackBar:MatSnackBar
  acceptTermsAndConditions: boolean

  userName: FormControl
  firstName: FormControl
  lastName: FormControl

  constructor(http: HttpClient, snackBar:MatSnackBar, router: Router) {
    this.http = http
    this.user = new RegisterModel()
    this.snackBar = snackBar
    this.acceptTermsAndConditions = false
    this.router = router

    this.userName = new FormControl(
      '', [Validators.required, Validators.minLength(3), Validators.maxLength(15)])
    this.firstName = new FormControl(
      '', [Validators.required, Validators.minLength(3), Validators.maxLength(15)])
    this.lastName = new FormControl(
      '', [Validators.required, Validators.minLength(3), Validators.maxLength(15)])
  }
  
  get formInvalid(): boolean {
    return (
      this.userName.invalid ||
      this.firstName.invalid ||
      this.lastName.invalid
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

  getLastNameErrorMessage() : string {
    if (this.lastName.hasError('required')) {
      return 'You must enter a value!';
    }

    if(this.lastName.hasError('minlength')) {
      return this.lastName.hasError('minlength') ? 'Minimum lenght is 3 character!' : '';
    }
    else {
      return this.lastName.hasError('maxlength') ? 'Maximum lenght is 15 character!' : '';
    }
  }

  getFirstNameErrorMessage() : string {
    if (this.firstName.hasError('required')) {
      return 'You must enter a value!';
    }

    if(this.firstName.hasError('minlength')) {
      return this.firstName.hasError('minlength') ? 'Minimum lenght is 3 character!' : '';
    }
    else {
      return this.firstName.hasError('maxlength') ? 'Maximum lenght is 15 character!' : '';
    }
  }

  ngOnInit(): void {
    const token = localStorage.getItem('token');

    let headers = new HttpHeaders()
        .set('Authorization', 'Bearer ' + token)
        .set('Content-Type', 'application/json'); 

    console.log("headeer:"+headers)

    this.http
    .get<any>('http://localhost:5200/api/Auth/GetUserInfos', {headers})
    .subscribe(
      (success) => {
        console.log(success)
        this.user.userName = success.userName
        this.user.email = success.email
        this.user.firstName = success.firstName
        this.user.lastName = success.lastName
        this.user.password = success.password
      },
      (error) => {
        this.snackBar.open('An error happened, please ty again.', 'Close', { duration: 5000 })
      })
  }

  public async updateUser(): Promise<void>{
    const token = localStorage.getItem('token');

    const response = await fetch("http://localhost:5200/api/Auth/Update", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        'Authorization': 'Bearer ' + token
      },
      body: JSON.stringify(this.user),
    });

    if(response.ok == true){
      this.router.navigate(['/logout'])
    }
  }
}