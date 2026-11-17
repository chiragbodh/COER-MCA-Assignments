import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BookService } from './book.service';
@Component({selector:'app-book-list',template:`<h3>Book list</h3><ul>@for(book of books();track book.id){<li>{{book.title}} - {{book.author}}</li>}</ul>`})
export class BookListComponent {private service=inject(BookService);books=this.service.getBooks();}
@Component({selector:'app-add-book',imports:[FormsModule],template:`<h3>Add a book</h3><form (ngSubmit)="save()">
  <label>Book title<input name="title" [(ngModel)]="title" required maxlength="150"></label>
  <label>Author<input name="author" [(ngModel)]="author" required maxlength="100"></label>
  <button [disabled]="!title.trim()||!author.trim()">Add book</button></form><p role="status">{{message}}</p>`})
export class AddBookComponent {
  private service=inject(BookService);title='';author='';message='';
  save(){if(!this.title.trim()||!this.author.trim())return;this.service.addBook(this.title,this.author);this.title='';this.author='';this.message='Book added to the shared list.';}
}
@Component({imports:[BookListComponent,AddBookComponent],template:'<h2>Shared book service</h2><app-add-book /><app-book-list /><p>Data persists while this app is open and resets on refresh.</p>'})
export class BooksComponent {}
