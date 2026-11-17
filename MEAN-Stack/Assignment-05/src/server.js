import { connect } from './db.js';
import { createApp } from './app.js';
let client;
try{
  client=await connect();
  const app=createApp(client.db('AssignmentDemoDB'));
  const port=Number(process.env.PORT||3200);
  const server=app.listen(port,'127.0.0.1',()=>console.log(`Local practice API: http://127.0.0.1:${port}`));
  const stop=()=>server.close(async()=>{await client.close();process.exit(0);});
  process.once('SIGINT',stop);process.once('SIGTERM',stop);
}catch(error){console.error(error.message);await client?.close();process.exitCode=1;}
