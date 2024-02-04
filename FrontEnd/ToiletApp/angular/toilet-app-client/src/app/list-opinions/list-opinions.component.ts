import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AfterViewInit, Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { Opinion } from '../_models/opinion';

@Component({
  selector: 'app-list-opinions',
  templateUrl: './list-opinions.component.html',
  styleUrls: ['./list-opinions.component.scss']
})
export class ListOpinionsComponent implements OnInit {
  http: HttpClient
  opinions: Array<Opinion>
  snackBar: MatSnackBar
  router: Router
  route: ActivatedRoute
  averageStars: number


  constructor( snackBar: MatSnackBar, http: HttpClient, router: Router, route: ActivatedRoute) {
    this.http = http
    this.opinions = []
    this.snackBar = snackBar
    this.router = router
    this.route = route
    this.averageStars = 1;
  }
  
  ngOnInit(): void {
    const token = localStorage.getItem('token');

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token
    });

    this.route.params.subscribe(param => {
      let tId = param['id'];

      this.http
      .get<Array<Opinion>>('http://localhost:5200/Opinion/GetOpinions/'+tId, { headers })
      .subscribe(resp => {
        resp.map(x => {
          let opinion = new Opinion()
          let oDate = new Date(x.date)
          opinion.uid = x.uid
          opinion.dateString = oDate.toLocaleDateString("en-US");
          opinion.date = x.date
          opinion.description = x.description
          opinion.stars = x.stars
          opinion.toiletUid = x.toiletUid
          opinion.userUid = x.userUid

          this.opinions.push(opinion);
        })
      })
    })
  }

  getOpinionCount(): number {
    if(this.opinions.length !== 0) {
      var l = this.opinions.length;
      return l
    }
    return 0;
  }

  deleteOpinion(toiletId: string, opinionId: string): void {
    const token = localStorage.getItem('token');
    let headers = new HttpHeaders()
        .set('Authorization', 'Bearer ' + token)
        .set('Content-Type', 'application/json'); 

    const url1 = 'http://localhost:5200/Opinion/DeleteOpinion?tuid='+toiletId+"&ouid="+opinionId
    this.http
      .delete(url1, {headers})
      .subscribe(
        (success) => {
          this.snackBar.open('Delete was successful!', 'Close', { duration: 5000 })
          this.opinions = [];
          this.ngOnInit();
        },
        (error) => {
          this.snackBar.open('Error occured, please try again.', 'Close', { duration: 5000 })
        }
      )
  }

  amICreated(id: string): boolean  {
    let userId = localStorage.getItem('uid');
    return (userId === id)
  }
}
