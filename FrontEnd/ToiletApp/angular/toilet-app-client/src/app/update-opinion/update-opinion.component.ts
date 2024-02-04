import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { updateOpinion } from '../_models/updateOpinion';
import { FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-update-opinion',
  templateUrl: './update-opinion.component.html',
  styleUrls: ['./update-opinion.component.scss']
})
export class UpdateOpinionComponent implements OnInit{
  http: HttpClient
  snackBar: MatSnackBar
  router: Router
  route: ActivatedRoute
  UpdateOpinionViewmodel: updateOpinion
  toiletUid: string
  maxDate: Date

  description: FormControl
  date: FormControl

  constructor(http: HttpClient, snackBar: MatSnackBar, router: Router, route: ActivatedRoute) {
    this.http = http
    this.snackBar = snackBar
    this.router = router
    this.route = route
    this.UpdateOpinionViewmodel = new updateOpinion()
    this.toiletUid = ""
    this.maxDate =new Date()

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
      let oId = param['id']
      this.http
      .get<any>('http://localhost:5200/Opinion/GetEditOpinion/'+oId, { headers })
      .subscribe(
        (success) => {
          this.UpdateOpinionViewmodel.id = success.uid
          this.UpdateOpinionViewmodel.date = success.date
          this.UpdateOpinionViewmodel.description = success.description
          this.UpdateOpinionViewmodel.stars = success.stars
          this.UpdateOpinionViewmodel.toiiletUid = success.toiletUid
          this.toiletUid = success.toiletUid
        },
        (error) => {
          console.log(error)
        })
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
    this.UpdateOpinionViewmodel.stars = db+1;
  }

  starClickEmpty(db: number) {
    this.UpdateOpinionViewmodel.stars = this.UpdateOpinionViewmodel.stars + db + 1;
  }

  public EditOpinion() :void{
    const token = localStorage.getItem('token');

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token
    });

    this.http
      .put('http://localhost:5200/Opinion/EditOpinion', this.UpdateOpinionViewmodel, { headers })
      .subscribe(
        (success) => {
          this.snackBar.open('Edit was successful!', 'Close', { duration: 5000 })
          this.router.navigate(['/list-opinions/', this.toiletUid])
        },
        (error) => {
          this.snackBar.open('Error occured, please try again.', 'Close', { duration: 5000 })
        }
      )
  }
}
