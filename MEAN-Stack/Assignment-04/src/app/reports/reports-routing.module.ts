import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReportsComponent, SummaryComponent, DetailsComponent } from './reports.components';
const routes:Routes=[{path:'',component:ReportsComponent,children:[
  {path:'',redirectTo:'summary',pathMatch:'full'},
  {path:'summary',component:SummaryComponent},{path:'details',component:DetailsComponent}
]}];
@NgModule({imports:[RouterModule.forChild(routes)],exports:[RouterModule]})
export class ReportsRoutingModule {}
