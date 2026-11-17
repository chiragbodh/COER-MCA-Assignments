import { Component, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReportsRoutingModule } from './reports-routing.module';
import { ReportsComponent, SummaryComponent, DetailsComponent } from './reports.components';
@NgModule({declarations:[ReportsComponent,SummaryComponent,DetailsComponent],imports:[CommonModule,RouterModule,ReportsRoutingModule]})
export class ReportsModule {}
