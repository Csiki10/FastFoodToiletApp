import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Address } from '../_models/address';
import { Toilet } from '../_models/toilet';
import { institutionDictionary } from '../_models/institutionDictionary';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { ListToiletModel } from '../_models/toiletListModel';

@Component({
  selector: 'app-list-toilets',
  templateUrl: './list-toilets.component.html',
  styleUrls: ['./list-toilets.component.scss']
})
export class ListToiletsComponent implements OnInit{
  http: HttpClient
  toilets: Array<ListToiletModel>
  snackBar: MatSnackBar
  router: Router
  backupToilets: Array<ListToiletModel>

  constructor( snackBar: MatSnackBar, http: HttpClient, router: Router) {
    this.http = http
    this.toilets = []
    this.snackBar = snackBar
    this.router = router
    this.backupToilets = []
  }

  avg(opinions: Array<any>): number {
    if(opinions !== null) {
      const totalStars = opinions.reduce((acc, opinion) => acc + opinion.stars, 0);
      const averageStars = Math.round(totalStars / opinions.length);
      return averageStars
    }    
    return 0;
  }


  ngOnInit(): void {
    this.closeFilter('institution','filter');
    this.closeFilter('rating','filter');
    this.closeMobilFilter('institution');
    this.closeMobilFilter('rating');
    this.closeFilterTab();

    this.getToilets();
  }

  getInstitutionString(value: number): string {
    const keys = Object.keys(institutionDictionary);
    for (const key of keys) {
      if (institutionDictionary[key] === value) {
        return key;
      }
    }
    return "";
  };

  deleteToilet(id: string): void {
    const token = localStorage.getItem('token');
    let headers = new HttpHeaders()
        .set('Authorization', 'Bearer ' + token)
        .set('Content-Type', 'application/json'); 

    const url1 = 'http://localhost:5200/api/Toilet/DeleteToilet/'+id
    this.http
      .delete(url1, {headers})
      .subscribe(
        (success) => {
          this.snackBar.open('Delete was successful!', 'Close', { duration: 5000 })
          this.toilets = [];
          this.ngOnInit();
        },
        (error) => {
          this.snackBar.open('Error occured, please try again.', 'Close', { duration: 5000 })
        }
      )
  }

  amICreated(id: string): boolean  {
    let userId1 = localStorage.getItem('uid');
    return (userId1 === id)
  }

  changeIcon(name: string, type: string) {
    var fPlus = document.getElementById(type+'-plus-'+name)
    var fMinus = document.getElementById(type+'-minus-'+name)
    var fInstitutions = document.getElementById(type+'-filter-'+name)

    if(fMinus != null && fInstitutions != null && fPlus != null){
      if(fPlus.style.display == "block") {
        fMinus.style.display = "block"
        fPlus.style.display = "none"
        fInstitutions.style.display = "block"
      }
      else {
        fMinus.style.display = "none"
        fPlus.style.display = "block"     
        fInstitutions.style.display = "none"
      }
    }
  }

  changeIconMobile(name: string) {
    var fPlus = document.getElementById('mobil-plus-'+name)
    var fMinus = document.getElementById('mobil-minus-'+name)
    var fInstitutions = document.getElementById(name+'-filter-mobile')

    if(fMinus != null && fInstitutions != null && fPlus != null){
      if(fPlus.style.display == "block") {
        fMinus.style.display = "block"
        fPlus.style.display = "none"
        fInstitutions.style.display = "block"
      }
      else {
        fMinus.style.display = "none"
        fPlus.style.display = "block"     
        fInstitutions.style.display = "none"
      }
    }
  }

  public closeFilter(name: string, type: string): void{
    var fPlus = document.getElementById(type+'-plus-'+name)
    var fMinus = document.getElementById(type+'-minus-'+name)
    var fInstitutions = document.getElementById(type+'-filter-'+name)

    if(fMinus != null && fInstitutions != null && fPlus != null){
      fPlus.style.display = "block"
      fMinus.style.display = "none"
      fInstitutions.style.display = "none"
    }
  }

  public openFilter(name: string, type: string): void{
    var fPlus = document.getElementById(type+'-plus-'+name)
    var fMinus = document.getElementById(type+'-minus-'+name)
    var fInstitutions = document.getElementById(type+'-filter-'+name)

    if(fMinus != null && fInstitutions != null && fPlus != null){
      fMinus.style.display = "block"
      fPlus.style.display = "none"
      fInstitutions.style.display = "block"
    }
  }

  public closeMobilFilter(name: string): void{
    var fPlus = document.getElementById('mobil-plus-'+name)
    var fMinus = document.getElementById('mobil-minus-'+name)
    var fInstitutions = document.getElementById(name+'-filter-mobile')

    if(fMinus != null && fInstitutions != null && fPlus != null){
      fPlus.style.display = "block"
      fMinus.style.display = "none"
      fInstitutions.style.display = "none"
    }
    
  }

  public openMobilFilter(name: string): void{
    var fPlus = document.getElementById('mobil-plus-'+name)
    var fMinus = document.getElementById('mobil-minus-'+name)
    var fInstitutions = document.getElementById(name+'-filter-mobile')

    if(fMinus != null && fInstitutions != null && fPlus != null){
      fMinus.style.display = "block"
      fPlus.style.display = "none"
      fInstitutions.style.display = "block"
    }
  }

  public closeFilterTab(): void{
    var tab = document.getElementById('filter-tab')
    var background = document.getElementById('tab-background')
    var filterTabDiv = document.getElementById('filterTabDiv')

    if(tab != null && background != null && filterTabDiv != null){
      tab.style.display = "none"
      background.style.display = "none"
      filterTabDiv.style.display = "none"
    }
  }

  public openFilterTab(): void{
    var tab = document.getElementById('filter-tab')
    var background = document.getElementById('tab-background')
    var filterTabDiv = document.getElementById('filterTabDiv')

    if(tab != null && background != null && filterTabDiv != null){
      tab.style.display = "block"
      background.style.display = "block"
      filterTabDiv.style.display = "block"
    }
  }

  public InstitutionFilter(): void{
    this.toilets = this.backupToilets;
  
    var filterResult = this.getCheckedValues('filter-filter-institution');

    if(filterResult.length != 0){
      const matchingToilets: ListToiletModel[] = this.toilets.filter((toilet) =>
      filterResult.includes(toilet.institutionString));
  
      this.toilets = matchingToilets;
    }
  }

  public RatingFilter(): void{
    this.toilets = this.backupToilets;
  
    var filterResult = this.getCheckedValues('filter-filter-rating');

    if(filterResult.length != 0){
      const matchingToilets: ListToiletModel[] = this.toilets.filter((toilet) =>
      filterResult.includes(toilet.avgStar.toString()));
  
      this.toilets = matchingToilets;
    }
  }

  public RatingFilterMobile(): void{
    this.toilets = this.backupToilets;
  
    var filterResult = this.getCheckedValues('rating-filter-mobile');

    if(filterResult.length != 0){
      const matchingToilets: ListToiletModel[] = this.toilets.filter((toilet) =>
      filterResult.includes(toilet.avgStar.toString()));
  
      this.toilets = matchingToilets;
    }
  }

  getCheckedValues(id:string): string[] {
    const filterSection = document.getElementById(id) as HTMLDivElement;
    const checkboxes = filterSection.querySelectorAll<HTMLInputElement>('input[type="checkbox"]');
    const checkedValues: string[] = [];

    checkboxes.forEach((checkbox) => {
      if (checkbox.checked) {
        checkedValues.push(checkbox.value);
      }
    });

    return checkedValues;
  }

  InstitutionFilterMobile(): void{
    this.toilets = this.backupToilets;
  
    var filterResult = this.getCheckedValuesMobile();

    if(filterResult.length != 0){
      const matchingToilets: ListToiletModel[] = this.toilets.filter((toilet) =>
      filterResult.includes(toilet.institutionString));
  
      this.toilets = matchingToilets;
    }
  }

  getCheckedValuesMobile(): string[] {
    const filterSection = document.getElementById('institution-filter-mobile') as HTMLDivElement;
    const checkboxes = filterSection.querySelectorAll<HTMLInputElement>('input[type="checkbox"]');
    const checkedValues: string[] = [];

    checkboxes.forEach((checkbox) => {
      if (checkbox.checked) {
        checkedValues.push(checkbox.value);
      }
    });

    return checkedValues;
  }

  getToilets(): void{
    this.http
    .get<Array<any>>('http://localhost:5200/api/api/Toilet/GetToilets')
    .subscribe(resp => {
      resp.map(x => {
        let address = new Address();
        address.uid = x.address.uid;
        address.city = x.address.city;
        address.street = x.address.street;
        address.postCode = x.address.postCode;
        address.toiletUid = x.address.toiletUid;

        let newToilet = new ListToiletModel();
        newToilet.id = x.address.toiletUid;
        newToilet.code = x.code;
        newToilet.userId = x.userId;
        newToilet.imageUrl = x.imageUrl;
        newToilet.address = address;
        newToilet.institution = x.institution;
        newToilet.userImage = x.user.imageUrl
        newToilet.userName = x.user.userName
        newToilet.institutionString = this.getInstitutionString(x.institution);
        
        if(isNaN(this.avg(x.opinions))) {
          newToilet.avgStar = 0
        }
        else{
          newToilet.avgStar = this.avg(x.opinions)
        }
        this.toilets.push(newToilet);
      }) 
    })

    this.backupToilets = this.toilets;
  }

}  
 

