import { Component, Injectable, inject, signal } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';
@Component({template:'<h2>Home</h2><p>Explore courses, grouped student routes, shared books, API users and lazy reports.</p><p>All records are sample data.</p>'})
export class HomeComponent {}
@Component({template:'<h2>Dashboard</h2><p>Use Students for child routing and Reports for the lazy feature.</p>'})
export class DashboardComponent {}
@Component({template:'<h2>Settings</h2><p>This sample portal uses local demonstration data.</p>'})
export class SettingsComponent {}
@Component({imports:[RouterLink],template:'<h2>404 - Page not found</h2><p>The requested route does not exist.</p><a routerLink="/">Return home</a>'})
export class PageNotFoundComponent {}
@Injectable({providedIn:'root'})
export class StudentService {
  readonly names=signal(['Asha','Ravi']);
  add(name:string) { if(name.trim()) this.names.update(names=>[...names,name.trim()]); }
}
@Component({imports:[RouterLink,RouterOutlet],template:'<h2>Students</h2><nav><a routerLink="list">Student list</a><a routerLink="add">Add student</a></nav><router-outlet />'})
export class StudentsComponent {}
@Component({template:'<h3>Student list</h3><ul>@for(name of store.names(); track $index){<li>{{name}}</li>}</ul>'})
export class StudentListComponent { store=inject(StudentService); }
@Component({imports:[FormsModule],template:`<h3>Add student</h3><form (ngSubmit)="add()"><label>Student name<input name="student" [(ngModel)]="name" required maxlength="100"></label><button [disabled]="!name.trim()">Add student</button></form><p role="status">{{message}}</p>`})
export class AddStudentComponent {
  store=inject(StudentService); name=''; message='';
  add(){if(!this.name.trim())return;this.store.add(this.name);this.message='Student added. Open Student list.';this.name='';}
}
