import { MongoMemoryServer } from 'mongodb-memory-server';
// Runs a real isolated mongod process for practice, not a mocked database.
const mongo=await MongoMemoryServer.create({instance:{port:27019,ip:'127.0.0.1'}});
console.log(`Temporary local MongoDB: ${mongo.getUri()}`);
console.log('Use this URI in .env and MongoDB Compass. Data is discarded when stopped.');
let stopping=false;
async function stop(){if(stopping)return;stopping=true;await mongo.stop();process.exit(0);}
process.once('SIGINT',stop);process.once('SIGTERM',stop);
