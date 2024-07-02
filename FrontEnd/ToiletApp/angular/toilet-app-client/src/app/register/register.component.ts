import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormControl, UntypedFormControl, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { RegisterModel } from '../_models/registermodel';
import { ImageSnippet } from '../_models/ImageSnippet';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})

export class RegisterComponent {
  router: Router
  http: HttpClient
  
  snackBar: MatSnackBar
  registerModel: RegisterModel
  acceptTermsAndConditions: boolean
  selectedFile: ImageSnippet | undefined
  formData: FormData
  hide = true;

  password: FormControl
  userName: FormControl
  firstName: FormControl
  lastName: FormControl
  email: FormControl

  constructor(http: HttpClient, snackBar: MatSnackBar, router: Router) {
    this.snackBar = snackBar
    this.http = http
    this.router = router
    this.acceptTermsAndConditions = false
    this.registerModel = new RegisterModel()
    this.email = new FormControl('', [Validators.required, Validators.email])
    this.formData = new FormData()
    this.password = new FormControl(
      '', [Validators.required,  Validators.minLength(3), Validators.maxLength(15)])
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
      this.email.invalid ||
      this.password.invalid ||
      this.firstName.invalid ||
      this.lastName.invalid
    );
  }

  getEmailErrorMessage() : string {
    if (this.email.hasError('required')) {
      return 'You must enter a value!';
    }
    return this.email.hasError('email') ? 'Not a valid email!' : '';
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

  public sendRegisterCredentials() : void {
    this.formData = new FormData();
    this.formData.append('email', this.registerModel.email);
    this.formData.append('userName', this.registerModel.userName);
    this.formData.append('firstName', this.registerModel.firstName);
    this.formData.append('lastName', this.registerModel.lastName);
    this.formData.append('password', this.registerModel.password);
    this.formData.append('imageUrl',this.registerModel.imageUrl );

    this.http.put('http://localhost:5200/api/Auth/InsertUser', this.formData, {reportProgress: true, observe: 'events'})
    .subscribe(
      (success) => {
        this.snackBar
        .open('Registration was successful!', 'Close', { duration: 5000 })
        .afterDismissed()
        .subscribe(() => {
          this.router.navigate(['/login'])
        })
      },
      (error) => {
        this.snackBar.open('An error happened, please ty again.', 'Close', { duration: 5000 })
      })
  }

}