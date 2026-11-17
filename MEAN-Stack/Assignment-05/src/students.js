import { pathToFileURL } from 'node:url';
import { connect } from './db.js';
const marker='mca-assignment-05';
export async function demonstrateStudents(client) {
  const students=client.db('CollegeDB').collection('Students');
  const samples=[['Asha','MCA',78],['Ravi','MCA',84],['Neha','BCA',72],['Kabir','MCA',91],['Isha','BCA',88]];
  for(let i=0;i<samples.length;i++) {
    const [name,course,marks]=samples[i];
    // Stable demo IDs make reruns repeatable without deleting the collection.
    await students.updateOne({_id:`mca-demo-student-${i+1}`},{$set:{studentId:91001+i,name,course,semester:3,marks,demo:marker}},{upsert:true});
  }
  await students.updateOne({_id:'mca-demo-student-6'},{$set:{studentId:91006,name:'Temporary Student',course:'MCA',semester:3,marks:70,demo:marker}},{upsert:true});
  const all=await students.find({demo:marker},{projection:{_id:0,demo:0}}).sort({studentId:1}).toArray();
  const byCourse=await students.find({demo:marker,course:'MCA'},{projection:{_id:0,demo:0}}).sort({studentId:1}).toArray();
  const update=await students.updateOne({demo:marker,studentId:91001},{$set:{marks:92}});
  const updated=await students.findOne({demo:marker,studentId:91001},{projection:{_id:0,demo:0}});
  const removed=await students.deleteOne({demo:marker,studentId:91006});
  return {all,byCourse,matchedForUpdate:update.matchedCount,updated,deletedCount:removed.deletedCount,remaining:await students.countDocuments({demo:marker})};
}
if(process.argv[1] && import.meta.url===pathToFileURL(process.argv[1]).href){
  let client;try{client=await connect();console.log(JSON.stringify(await demonstrateStudents(client),null,2));}
  catch(error){console.error(error.message);process.exitCode=1;}finally{await client?.close();}
}
