import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-delete-user',
  templateUrl: './delete-user.component.html',
  styleUrls: ['./delete-user.component.scss']
})
export class DeleteUserComponent {
  http: HttpClient
  snackBar:MatSnackBar

  constructor(http: HttpClient, snackBar:MatSnackBar) {
    this.http = http
    this.snackBar = snackBar
  }
  
  public DeleteMyself(): void { 
    const token = localStorage.getItem('token');

    let headers = new HttpHeaders()
        .set('Authorization', 'Bearer ' + token)
        .set('Content-Type', 'application/json'); 

    this.http
    .delete<any>('http://localhost:5200/api/Auth/DeleteMyself', {headers})
    .subscribe(
      (success) => {
        this.snackBar.open('Success! It was nice to meet you!', 'Close', { duration: 5000 })
      },
      (error) => {
        this.snackBar.open('An error happened, please ty again.', 'Close', { duration: 5000 })
      })
  }

}
