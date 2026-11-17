const base=process.env.API_URL||'http://127.0.0.1:3200';
async function request(path,method='GET',body){
  const response=await fetch(base+path,{method,headers:{'Content-Type':'application/json'},body:body===undefined?undefined:JSON.stringify(body)});
  const value=response.status===204?null:await response.json();
  if(!response.ok)throw new Error(`${response.status}: ${value?.error}`);
  console.log(method,path,response.status,JSON.stringify(value));
  return value;
}
let created;
try{
  created=await request('/api/tasks','POST',{title:'Complete MCA assignment',status:'pending'});
  await request('/api/tasks');
  await request(`/api/tasks/${created._id}`,'PUT',{title:created.title,status:'done'});
  await request(`/api/tasks/${created._id}`,'DELETE');created=null;
  await request('/api/tasks');
}catch(error){console.error(error.message);process.exitCode=1;}
finally{if(created){try{await request(`/api/tasks/${created._id}`,'DELETE');}catch{console.error('Demo task could not be cleaned up.');}}}
