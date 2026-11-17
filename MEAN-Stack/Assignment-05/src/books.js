function text(value,name){if(typeof value!=='string'||!value.trim())throw new TypeError(`${name} is required`);return value.trim();}
function price(value){if(typeof value!=='number'||!Number.isFinite(value)||value<0)throw new TypeError('price must be nonnegative');return value;}
export async function createBookStore(client){
  const books=client.db('LibraryDB').collection('Books');
  await books.createIndex({isbn:1},{unique:true});
  return {
    async addBook(book){
      if(typeof book.available!=='boolean')throw new TypeError('available must be boolean');
      const value={isbn:text(book.isbn,'isbn'),title:text(book.title,'title'),price:price(book.price),available:book.available};
      const result=await books.insertOne(value);return {...value,_id:result.insertedId};
    },
    async getAllBooks(){return books.find().sort({isbn:1}).toArray();},
    async findBookByISBN(isbn){return books.findOne({isbn:text(isbn,'isbn')});},
    async updateBook(isbn,changes){
      const update={};
      if('price' in changes)update.price=price(changes.price);
      if('available' in changes){if(typeof changes.available!=='boolean')throw new TypeError('available must be boolean');update.available=changes.available;}
      if(!Object.keys(update).length)throw new TypeError('Provide price or available');
      return books.findOneAndUpdate({isbn:text(isbn,'isbn')},{$set:update},{returnDocument:'after'});
    },
    async deleteBook(isbn){return books.deleteOne({isbn:text(isbn,'isbn')});}
  };
}
