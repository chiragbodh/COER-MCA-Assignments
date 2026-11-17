import express from 'express';
import { ObjectId } from 'mongodb';

function fail(message){const error=new Error(message);error.status=400;throw error;}
function bodyObject(body){if(!body||typeof body!=='object'||Array.isArray(body))fail('A JSON object is required');return body;}
function name(value,key,max=120){if(typeof value!=='string'||!value.trim()||value.trim().length>max)fail(`${key} must contain 1-${max} characters`);return value.trim();}
function product(body){
  bodyObject(body);
  if(Object.keys(body).some(k=>!['name','price','stock'].includes(k)))fail('Allowed fields: name, price, stock');
  if(typeof body.price!=='number'||!Number.isFinite(body.price)||body.price<0)fail('price must be a nonnegative number');
  if(!Number.isSafeInteger(body.stock)||body.stock<0)fail('stock must be a nonnegative integer');
  return {name:name(body.name,'name'),price:body.price,stock:body.stock};
}
function task(body){
  bodyObject(body);
  if(Object.keys(body).some(k=>!['title','status'].includes(k)))fail('Allowed fields: title, status');
  const status=body.status??'pending';
  if(!['pending','in-progress','done'].includes(status))fail('Invalid task status');
  return {title:name(body.title,'title',200),status};
}
function id(value){if(!/^[0-9a-fA-F]{24}$/.test(value))fail('Invalid ID: expected 24 hexadecimal characters');return new ObjectId(value);}

export function createApp(db){
  const app=express();
  app.disable('x-powered-by');
  app.use(express.json({limit:'16kb'}));
  app.get('/health',(_req,res)=>res.json({status:'ok'}));
  for(const [resource,collectionName,validate] of [['products','Products',product],['tasks','Tasks',task]]){
    const collection=db.collection(collectionName);
    const route=`/api/${resource}`;
    app.post(route,async(req,res)=>{const value=validate(req.body);const result=await collection.insertOne(value);res.status(201).location(`${route}/${result.insertedId}`).json({...value,_id:result.insertedId});});
    app.get(route,async(_req,res)=>res.json(await collection.find().sort({_id:1}).toArray()));
    app.get(`${route}/:id`,async(req,res)=>{const value=await collection.findOne({_id:id(req.params.id)});if(!value)return res.status(404).json({error:'Not found'});res.json(value);});
    // PUT supplies all editable fields; the immutable MongoDB _id is never accepted from JSON.
    app.put(`${route}/:id`,async(req,res)=>{const key=id(req.params.id);const value=validate(req.body);const updated=await collection.findOneAndUpdate({_id:key},{$set:value},{returnDocument:'after'});if(!updated)return res.status(404).json({error:'Not found'});res.json(updated);});
    app.delete(`${route}/:id`,async(req,res)=>{const result=await collection.deleteOne({_id:id(req.params.id)});if(!result.deletedCount)return res.status(404).json({error:'Not found'});res.status(204).end();});
  }
  app.use((_req,res)=>res.status(404).json({error:'Route not found'}));
  app.use((error,_req,res,_next)=>{
    if(error.type==='entity.parse.failed')return res.status(400).json({error:'Invalid JSON'});
    if(error.type==='entity.too.large')return res.status(413).json({error:'Request body too large'});
    if(error.status===400)return res.status(400).json({error:error.message});
    if(error.code===11000)return res.status(409).json({error:'Duplicate record'});
    console.error('Database/request operation failed'); // Do not expose connection strings or internals to clients.
    res.status(500).json({error:'Internal server error'});
  });
  return app;
}
