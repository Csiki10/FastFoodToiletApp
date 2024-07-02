import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { institutionDictionary } from '../_models/institutionDictionary';
import { Toilet } from '../_models/toilet';
import { FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-update-toilet',
  templateUrl: './update-toilet.component.html',
  styleUrls: ['./update-toilet.component.scss']
})
export class UpdateToiletComponent  implements OnInit  {
  http: HttpClient
  UpdateToiletViewModel: Toilet
  snackBar: MatSnackBar
  router: Router
  route: ActivatedRoute

  code: FormControl
  city: FormControl
  street: FormControl
  postCode: FormControl
  institution: FormControl

  constructor(http: HttpClient, snackBar: MatSnackBar, router: Router, route: ActivatedRoute) {
    this.http = http
    this.UpdateToiletViewModel = new Toilet()
    this.snackBar = snackBar
    this.router = router
    this.route = route

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

  ngOnInit(): void {
    const token = localStorage.getItem('token');

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token
    });

    this.route.params.subscribe(param => {
      let tId = param['id']
      this.http
      .get<any>('http://localhost:5200/api/Toilet/GetToilet/'+tId, { headers })
      .subscribe(
        (success) => {
          this.UpdateToiletViewModel.id = success.uid
          this.UpdateToiletViewModel.code = success.code
          this.UpdateToiletViewModel.imageUrl = success.imageUrl
          this.UpdateToiletViewModel.institution = success.institution
          this.UpdateToiletViewModel.address.city = success.address.city
          this.UpdateToiletViewModel.address.postCode = success.address.postCode
          this.UpdateToiletViewModel.address.street = success.address.street
        },
        
        (error) => {
          console.log(error)
        })
    })
  }

  institutionOptions = Object.keys(institutionDictionary).map(key => ({
    label: key,
    value: institutionDictionary[key]
  }));

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

  public EditToilet(): void {
    const token = localStorage.getItem('token');

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token
    });

    this.http
      .put('http://localhost:5200/api/Toilet/EditToilet', this.UpdateToiletViewModel, { headers })
      .subscribe(
        (success) => {
          this.snackBar.open('Edit was successful!', 'Close', { duration: 5000 })
          this.router.navigate(['/list-toilets'])
        },
        (error) => {
          this.snackBar.open('Error occured, please try again.', 'Close', { duration: 5000 })
        }
      )
  }
}
