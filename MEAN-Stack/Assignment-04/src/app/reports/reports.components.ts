import { Component } from '@angular/core';
@Component({standalone:false,template:'<h2>Reports feature</h2><nav><a routerLink="summary">Summary</a><a routerLink="details">Details</a></nav><router-outlet />'})
export class ReportsComponent {}
@Component({standalone:false,template:'<h3>Reports summary</h3><p>Illustrative summary: 2 courses are available in this portal.</p>'})
export class SummaryComponent {}
@Component({standalone:false,template:'<h3>Reports details</h3><p>MCA: postgraduate computer applications. BCA: undergraduate computer applications.</p>'})
export class DetailsComponent {}
