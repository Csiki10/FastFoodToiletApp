import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { RegisterModel } from '../_models/registermodel';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent implements OnInit {
  api:ApiService
  http: HttpClient
  router: Router
  user: RegisterModel
  
  constructor(api: ApiService, http: HttpClient, router: Router) {
    this.api = api
    this.http = http
    this.router = router
    this.user = new RegisterModel()
  }
  ngOnInit(): void {
    const token = localStorage.getItem('token');

    let headers = new HttpHeaders()
        .set('Authorization', 'Bearer ' + token)
        .set('Content-Type', 'application/json'); 

    this.http
    .get<any>('http://localhost:5200/Auth/GetUserInfos', {headers})
    .subscribe(
      (success) => {
        this.user.userName = success.userName
        this.user.email = success.email
        this.user.firstName = success.firstName
        this.user.lastName = success.lastName
        this.user.password = success.password
        this.user.imageUrl = success.imageUrl
      },
      (error) => {
        console.log(error);
      })
  }

  changeUserMenu() {
    var userMenu = document.getElementById("user-menu");
    var menuButton = document.getElementById("user-menu-button");
  
    if(userMenu != null && menuButton != null) {
      if (userMenu.style.display === "block") {
        // Hide the menu
        userMenu.style.display = "none";
        menuButton.setAttribute("aria-expanded", "false");
      } else {
        // Show the menu
        userMenu.style.display = "block";
        menuButton.setAttribute("aria-expanded", "true");

        var menuItems = userMenu.getElementsByTagName("a");
        for (var i = 0; i < menuItems.length; i++) {
          menuItems[i].addEventListener("click", function() {
            // Hide the menu when a menu item is clicked
            if(userMenu != null && menuButton != null) {
              userMenu.style.display = "none";
              menuButton.setAttribute("aria-expanded", "false");
            }
          });
        }
      
      }
    }
    
  }

  toggleMobileMenu() {
    const mobileMenu = document.getElementById("mobile-menu");
    const menuButton = document.querySelector("[aria-controls='mobile-menu']");
  
    if(mobileMenu != null && menuButton != null) {
      // Toggle the "hidden" class on the mobile menu
      mobileMenu.classList.toggle("hidden");
        
      // Toggle the "hidden" class on the menu button icons
      menuButton.querySelectorAll("svg").forEach((icon) => {
        icon.classList.toggle("hidden");
      });

      // Toggle the "aria-expanded" attribute
      const isExpanded = mobileMenu.classList.contains("hidden") ? "false" : "true";
      menuButton.setAttribute("aria-expanded", isExpanded);
    }
    
  }

  hideMenu() {
    const mobileMenu = document.getElementById('mobile-menu');
    if (mobileMenu) {
      mobileMenu.classList.add('hidden');
      //d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
    }
  }
}
