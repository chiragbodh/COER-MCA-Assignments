import { Component } from '@angular/core';
import { RouterLink, RouterOutlet, RouterLinkActive } from '@angular/router';
@Component({selector:'app-root', imports:[RouterLink, RouterOutlet, RouterLinkActive], template:`
  <header><p>MEAN STACK / ASSIGNMENT 04</p><h1>COER College Portal</h1>
  <nav aria-label="Main navigation">@for (item of links; track item.path) {
    <a [routerLink]="item.path" routerLinkActive="active" [routerLinkActiveOptions]="{exact:item.path==='/'}">{{item.label}}</a>
  }</nav></header><main><router-outlet /></main>`})
export class AppComponent {
  links=[{path:'/',label:'Home'},{path:'/courses',label:'Courses'},{path:'/dashboard',label:'Dashboard'},
    {path:'/students',label:'Students'},{path:'/settings',label:'Settings'},{path:'/books',label:'Books'},
    {path:'/users',label:'Users'},{path:'/reports',label:'Reports'}];
}
