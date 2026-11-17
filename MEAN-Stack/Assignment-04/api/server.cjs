// Local demonstration API; data is in memory and resets when this process restarts.
const http = require('node:http');
const users = [{ id: 1, name: 'Sample Student', email: 'student@example.test' }];
let nextId = 2;
const reply = (res, status, value) => {res.writeHead(status, {'Content-Type':'application/json'});res.end(JSON.stringify(value));};
http.createServer(async (req,res) => {
  if(req.url !== '/api/users') return reply(res,404,{error:'Not found'});
  if(req.method==='GET') return reply(res,200,users);
  if(req.method!=='POST') return reply(res,405,{error:'Method not allowed'});
  let body='';
  try {
    for await(const chunk of req){body+=chunk;if(Buffer.byteLength(body)>4096)return reply(res,413,{error:'Body too large'});}
    const value=JSON.parse(body);
    if(!value||typeof value.name!=='string'||typeof value.email!=='string'||!value.name.trim()||value.name.length>100||value.email.length>200||!/^\S+@\S+\.\S+$/.test(value.email.trim()))return reply(res,400,{error:'Valid name and email required'});
    const user={id:nextId++,name:value.name.trim(),email:value.email.trim()};users.push(user);reply(res,201,user);
  }catch{reply(res,400,{error:'Invalid JSON'});}
}).listen(4300,'127.0.0.1',()=>console.log('Local users API: http://127.0.0.1:4300/api/users'));
