import { randomUUID } from 'node:crypto';
import { connect } from './db.js';
import { createBookStore } from './books.js';
let client,store,created;
try{
  client=await connect();store=await createBookStore(client);
  const isbn=`DEMO-${randomUUID()}`; // Synthetic identifier, not a real published ISBN.
  created=await store.addBook({isbn,title:'MCA Practice Book',price:499,available:true});
  console.log('ADD',JSON.stringify(created));
  console.log('ALL',JSON.stringify(await store.getAllBooks()));
  console.log('FIND',JSON.stringify(await store.findBookByISBN(isbn)));
  console.log('UPDATE',JSON.stringify(await store.updateBook(isbn,{price:449,available:false})));
  console.log('DELETE',JSON.stringify(await store.deleteBook(isbn)));
  created=null;
}catch(error){console.error(error.message);process.exitCode=1;}
finally{try{if(created)await store.deleteBook(created.isbn);}finally{await client?.close();}}
