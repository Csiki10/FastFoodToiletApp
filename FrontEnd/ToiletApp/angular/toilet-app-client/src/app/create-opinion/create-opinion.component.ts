import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { AddOpinion } from '../_models/addOpinion';
import { FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-create-opinion',
  templateUrl: './create-opinion.component.html',
  styleUrls: ['./create-opinion.component.scss']
})
export class CreateOpinionComponent  implements OnInit{
  http: HttpClient
  snackBar: MatSnackBar
  router: Router
  route: ActivatedRoute
  opinion: AddOpinion
  toiletUid: string
  maxDate: Date

  description: FormControl
  date: FormControl

  constructor(http: HttpClient, snackBar: MatSnackBar, router: Router, route: ActivatedRoute) {
    this.http = http
    this.snackBar = snackBar
    this.router = router
    this.route = route
    this.opinion = new AddOpinion
    this.toiletUid = ""
    this.maxDate =new Date()
    this.opinion.userUid = "";

    this.description = new FormControl(
      '', [Validators.required, Validators.maxLength(200)])
    this.date = new FormControl(
      '', [Validators.required])
  }

  get formInvalid(): boolean {
    return (
      this.description.invalid ||
      this.date.invalid
    );
  }

  ngOnInit(): void {
    const token = localStorage.getItem('token');

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token
    });

    this.route.params.subscribe(param => {
      this.opinion.toiletUid = param['id']
      this.opinion.stars = 1
    })
  }

  getDateErrorMessage() : string {
    if (this.date.hasError('required')) {
      return 'You must pick a date!';
    }
    return "";
  }

  getDesErrorMessage() : string {
    if (this.description.hasError('required')) {
      return 'You must leave a description!';
    }

    if(this.description.hasError('maxlength')) {
      return this.description.hasError('maxlength') ? 'Maximum lenght is 200 character!' : '';
    }

    return "";
  }

  starClick(db: number) {
    this.opinion.stars = db+1;
  }

  starClickEmpty(db: number) {
    this.opinion.stars = this.opinion.stars + db + 1;
  }

  AddOpinion(): void {
    const token = localStorage.getItem('token');

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token
    });

    this.http
      .post('http://localhost:5200/Opinion/AddOpinion',this.opinion, { headers })
      .subscribe(
        (success) => {
          this.snackBar.open('Add opinion was successful!', 'Close', { duration: 5000 })
          this.router.navigate(['/list-opinions/', this.opinion.toiletUid])
        },
        (error) => {
          this.snackBar.open('Error occured, please try again.', 'Close', { duration: 5000 })
        })
  }
}
