import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
const courses=[{id:101,name:'MCA',description:'Postgraduate study of computer applications.'},
  {id:102,name:'BCA',description:'Undergraduate foundations of computer applications.'}];
@Component({imports:[RouterLink],template:`<h2>Courses</h2><button (click)="show=!show">Toggle descriptions</button><ul>
  @for(course of courses; track course.id){<li><a [routerLink]="['/courses',course.id]">{{course.name}}</a>
    @if(show){<p>{{course.description}}</p>}</li>}</ul>`})
export class CoursesComponent {courses=courses;show=false;}
@Component({imports:[RouterLink],template:`<h2>Course details</h2>@if(course; as selected){
  <h3>{{selected.name}}</h3><p>Course ID: {{selected.id}}</p><p>{{selected.description}}</p>
  }@else{<p>Course not found.</p>}<a routerLink="/courses">Back to courses</a>`})
export class CourseDetailsComponent {
  // React to parameter changes even if Angular reuses this component instance.
  params=toSignal(inject(ActivatedRoute).paramMap);
  get course(){return courses.find(c=>String(c.id)===this.params()?.get('id'));}
}
