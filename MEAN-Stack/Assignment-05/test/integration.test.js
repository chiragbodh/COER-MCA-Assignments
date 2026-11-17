import { test } from 'node:test';
import assert from 'node:assert/strict';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { MongoClient } from 'mongodb';
import { writeFile, mkdir } from 'node:fs/promises';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { fileURLToPath } from 'node:url';
import { createApp } from '../src/app.js';
import { demonstrateStudents } from '../src/students.js';
import { demonstrateEmployees } from '../src/employees.js';
import { createBookStore } from '../src/books.js';

test('Q1-Q5 integration against an isolated real MongoDB instance',async()=>{
  const mongo=await MongoMemoryServer.create();
  const client=new MongoClient(mongo.getUri());
  let server;
  const evidence={};
  try{
    await client.connect();
    evidence.students=await demonstrateStudents(client);
    assert.equal(evidence.students.all.length,6);assert.equal(evidence.students.byCourse.length,4);
    assert.equal(evidence.students.updated.marks,92);assert.equal(evidence.students.deletedCount,1);assert.equal(evidence.students.remaining,5);
    evidence.employees=await demonstrateEmployees(client);
    assert.deepEqual(evidence.employees.salaryAbove60000.map(x=>x.salary),[90000,80000]);
    assert.deepEqual(evidence.employees.salaryDescending.map(x=>x.salary),[90000,80000,60000,50000,40000]);
    assert.deepEqual(evidence.employees.byDepartment,[{_id:'HR',averageSalary:45000,employeeCount:2},{_id:'IT',averageSalary:70000,employeeCount:2},{_id:'Sales',averageSalary:90000,employeeCount:1}]);
    assert.deepEqual(evidence.employees.departmentsAbove60000.map(x=>x._id),['IT','Sales']);
    const books=await createBookStore(client);
    const book=await books.addBook({isbn:'DEMO-001',title:'MCA Practice Book',price:499,available:true});
    assert.equal((await books.getAllBooks()).length,1);assert.equal((await books.findBookByISBN('DEMO-001')).title,book.title);
    const updated=await books.updateBook('DEMO-001',{price:449,available:false});assert.equal(updated.price,449);assert.equal(updated.available,false);
    await assert.rejects(()=>books.addBook({isbn:'DEMO-001',title:'Duplicate',price:1,available:true}),/duplicate key/i);
    assert.equal((await books.deleteBook('DEMO-001')).deletedCount,1);assert.equal(await books.findBookByISBN('DEMO-001'),null);
    evidence.books={created:book,updated,deletedCount:1};
    server=createApp(client.db('AssignmentDemoDB')).listen(0,'127.0.0.1');
    await new Promise(resolve=>server.once('listening',resolve));
    const base=`http://127.0.0.1:${server.address().port}`;
    const calls=[];
    const req=async(path,method='GET',body)=>{
      const response=await fetch(base+path,{method,headers:{'Content-Type':'application/json'},body:body===undefined?undefined:JSON.stringify(body)});
      const value=response.status===204?null:await response.json();calls.push({method,path,status:response.status,response:value});return {status:response.status,value};
    };
    for(const [resource,initial,change] of [['products',{name:'Keyboard',price:1200,stock:5},{name:'Keyboard',price:1100,stock:4}],['tasks',{title:'Complete MCA assignment',status:'pending'},{title:'Complete MCA assignment',status:'done'}]]){
      const path=`/api/${resource}`;
      assert.equal((await req(path,'POST',{})).status,400);
      const added=await req(path,'POST',initial);assert.equal(added.status,201);const key=added.value._id;
      assert.equal((await req(path)).value.length,1);
      assert.equal((await req(`${path}/${key}`)).value._id,key);
      assert.equal((await req(`${path}/invalid`)).status,400);
      assert.equal((await req(`${path}/000000000000000000000000`)).status,404);
      const changed=await req(`${path}/${key}`,'PUT',change);assert.equal(changed.status,200);
      for(const [field,value] of Object.entries(change))assert.equal(changed.value[field],value);
      assert.equal((await req(`${path}/${key}`,'DELETE')).status,204);
      assert.equal((await req(`${path}/${key}`,'DELETE')).status,404);
      assert.equal((await req(path)).value.length,0);
    }
    assert.equal((await req('/api/products','POST',{name:'X',price:-1,stock:0})).status,400);
    assert.equal((await req('/api/products','POST',{name:'X',price:1,stock:1.5})).status,400);
    assert.equal((await req('/api/tasks','POST',{title:'X',status:'wrong'})).status,400);
    const malformed=await fetch(base+'/api/products',{method:'POST',headers:{'Content-Type':'application/json'},body:'{'});assert.equal(malformed.status,400);
    evidence.api=calls;
    const clientRun=await promisify(execFile)(process.execPath,[fileURLToPath(new URL('../src/client.js',import.meta.url))],{env:{...process.env,API_URL:base},windowsHide:true});
    assert.match(clientRun.stdout,/POST \/api\/tasks 201/);
    assert.match(clientRun.stdout,/"status":"done"/);
    assert.equal(await client.db('AssignmentDemoDB').collection('Tasks').countDocuments(),0);
    evidence.clientOutput=clientRun.stdout;
    evidence.result='PASS: students, aggregation, books, products CRUD, tasks CRUD, invalid inputs and missing records';
    await mkdir(new URL('../evidence/',import.meta.url),{recursive:true});
    await writeFile(new URL('../evidence/integration-results.json',import.meta.url),JSON.stringify(evidence,null,2));
  }finally{
    if(server)await new Promise(resolve=>server.close(resolve));
    await client.close();await mongo.stop();
  }
});
