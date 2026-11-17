import { Routes } from '@angular/router';
import { HomeComponent, DashboardComponent, SettingsComponent, PageNotFoundComponent,
  StudentsComponent, StudentListComponent, AddStudentComponent } from './pages';
import { CoursesComponent, CourseDetailsComponent } from './courses';
import { BooksComponent } from './books/books.component';
import { UsersComponent } from './users/users.component';
export const routes: Routes = [
  {path:'',component:HomeComponent},
  {path:'courses',component:CoursesComponent},
  {path:'courses/:id',component:CourseDetailsComponent},
  {path:'dashboard',component:DashboardComponent},
  {path:'students',component:StudentsComponent,children:[
    {path:'',redirectTo:'list',pathMatch:'full'},
    {path:'list',component:StudentListComponent},
    {path:'add',component:AddStudentComponent}
  ]},
  {path:'settings',component:SettingsComponent},
  {path:'books',component:BooksComponent},
  {path:'users',component:UsersComponent},
  // The feature module is not imported elsewhere; it becomes a separate lazy chunk.
  {path:'reports',loadChildren:()=>import('./reports/reports.module').then(m=>m.ReportsModule)},
  {path:'**',component:PageNotFoundComponent} // Wildcard must remain last.
];
