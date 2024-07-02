import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Institution } from '../_models/istitutionEnum';
import { ToiletAddModel } from '../_models/toiletAddModel';
import { institutionDictionary } from '../_models/institutionDictionary';
import { Router } from '@angular/router';
import { FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-create-toilet',
  templateUrl: './create-toilet.component.html',
  styleUrls: ['./create-toilet.component.scss']
})
export class CreateToiletComponent {
  http: HttpClient
  toilet: ToiletAddModel
  snackBar: MatSnackBar
  router: Router

  code: FormControl
  city: FormControl
  street: FormControl
  postCode: FormControl
  institution: FormControl

  constructor(http: HttpClient, snackBar: MatSnackBar, router: Router) {
    this.http = http
    this.toilet = new ToiletAddModel()
    this.snackBar = snackBar
    this.router = router

    this.code = new FormControl(
      '', [Validators.required,  Validators.minLength(3), Validators.maxLength(20)])
    this.city = new FormControl(
      '', [Validators.required, Validators.minLength(2), Validators.maxLength(20)])
    this.street = new FormControl(
      '', [Validators.required, Validators.minLength(3), Validators.maxLength(20)])
    this.postCode = new FormControl(
      '', [Validators.required, 
        Validators.minLength(4), 
        Validators.maxLength(4),
        Validators.max(9999),
        Validators.min(1000),
      ])
    this.institution = new FormControl(
      '', [Validators.required])
  }

  get formInvalid(): boolean {
    return (
      this.code.invalid ||
      this.city.invalid ||
      this.street.invalid ||
      this.postCode.invalid ||
      this.institution.invalid
    );
  }

  getInstErrorMessage() : string {
    if (this.institution.hasError('required')) {
      return 'You select a value!';
    }
    return "";
  }

  getCodeErrorMessage() : string {
    if (this.code.hasError('required')) {
      return 'You must enter a value!';
    }

    if(this.code.hasError('minlength')) {
      return this.code.hasError('minlength') ? 'Minimum lenght is 3 character!' : '';
    }
    else {
      return this.code.hasError('maxlength') ? 'Maximum lenght is 20 character!' : '';
    }
  }

  getCityErrorMessage() : string {
    if (this.city.hasError('required')) {
      return 'You must enter a value!';
    }

    if(this.city.hasError('minlength')) {
      return this.city.hasError('minlength') ? 'Minimum lenght is 2 character!' : '';
    }
    else {
      return this.city.hasError('maxlength') ? 'Maximum lenght is 20 character!' : '';
    }
  }

  getStreetErrorMessage() : string {
    if (this.street.hasError('required')) {
      return 'You must enter a value!';
    }

    if(this.street.hasError('minlength')) {
      return this.street.hasError('minlength') ? 'Minimum lenght is 3 character!' : '';
    }
    else {
      return this.street.hasError('maxlength') ? 'Maximum lenght is 20 character!' : '';
    }
  }

  getPostCodeErrorMessage() : string {
    if (this.postCode.hasError('required')) {
      return 'You must enter a value!';
    }

    if(this.postCode.hasError('minlength')) {
      return this.postCode.hasError('minlength') ? 'PostCode lenght is 4 character!' : '';
    }
    else if(this.postCode.hasError('maxlength')){
      return 'PostCode lenght is 4 character!';
    }
    else if(this.postCode.hasError('min')) {
      return this.postCode.hasError('min') ? 'PostCode must be between 1000-9999!' : '';
    }
    else {
      return this.postCode.hasError('max') ? 'PostCode must be between1000-9999!' : '';
    }
  }

  institutionOptions = Object.keys(institutionDictionary).map(key => ({
    label: key,
    value: institutionDictionary[key]
  }));

  public async createToilet() : Promise<void> {
    this.toilet.userId = "";
    this.toilet.address.toiletUid = ""; 
    const token = localStorage.getItem('token');

    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token
    })

    this.http
      .post('http://localhost:5200/api/Toilet/AddToilet',this.toilet, { headers }
      )
      .subscribe(
        (success) => {
          this.snackBar.open('Create was successful!', 'Close', { duration: 5000 })
          this.router.navigate(['/list-toilets'])
        },
        (error) => {
          this.snackBar.open('Error occured, please try again.', 'Close', { duration: 5000 })
        }
      )
  }

}
