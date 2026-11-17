import { Injectable, signal } from '@angular/core';
export interface Book {id:number;title:string;author:string;}
@Injectable({providedIn:'root'})
export class BookService {
  private readonly data=signal<Book[]>([{id:1,title:'Learning Web Applications',author:'Sample Author'}]);
  readonly books=this.data.asReadonly();
  private nextId=2;
  getBooks(){return this.books;}
  addBook(title:string,author:string){
    if(!title.trim()||!author.trim())return;
    this.data.update(books=>[...books,{id:this.nextId++,title:title.trim(),author:author.trim()}]);
  }
}
