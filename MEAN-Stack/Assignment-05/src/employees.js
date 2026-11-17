import { pathToFileURL } from 'node:url';
import { connect } from './db.js';
export async function demonstrateEmployees(client) {
  const collection=client.db('CollegeDB').collection('Employees');
  const data=[['Asha','IT',60000],['Ravi','IT',80000],['Neha','HR',40000],['Kabir','HR',50000],['Isha','Sales',90000]];
  for(let i=0;i<data.length;i++) {
    const [name,department,salary]=data[i];
    await collection.updateOne({_id:`mca-demo-employee-${i+1}`},{$set:{employeeId:92001+i,name,department,salary,demo:'mca-assignment-05'}},{upsert:true});
  }
  const filter={demo:'mca-assignment-05'};
  const projection={_id:0,demo:0};
  const grouped=[{$match:filter},{$group:{_id:'$department',averageSalary:{$avg:'$salary'},employeeCount:{$sum:1}}}];
  return {
    salaryAbove60000:await collection.find({...filter,salary:{$gt:60000}},{projection}).sort({salary:-1}).toArray(),
    salaryDescending:await collection.find(filter,{projection}).sort({salary:-1,employeeId:1}).toArray(),
    byDepartment:await collection.aggregate([...grouped,{$sort:{_id:1}}]).toArray(),
    departmentsAbove60000:await collection.aggregate([...grouped,{$match:{averageSalary:{$gt:60000}}},{$sort:{_id:1}}]).toArray()
  };
}
if(process.argv[1] && import.meta.url===pathToFileURL(process.argv[1]).href){
  let client;try{client=await connect();console.log(JSON.stringify(await demonstrateEmployees(client),null,2));}
  catch(error){console.error(error.message);process.exitCode=1;}finally{await client?.close();}
}
