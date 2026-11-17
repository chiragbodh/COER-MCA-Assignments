const newman=require('newman');const path=require('node:path');const fs=require('node:fs');
if(!process.env.LAB_TEST_PASSWORD)throw Error('Set LAB_TEST_PASSWORD for the disposable local admin account.');
newman.run({collection:require('./MVC.postman_collection.json'),ignoreRedirects:true,reporters:[],envVar:[
 {key:'baseUrl',value:process.env.LAB_BASE_URL||'http://127.0.0.1:8091'},
 {key:'email',value:process.env.LAB_TEST_EMAIL||'admin@example.test'},
 {key:'password',value:process.env.LAB_TEST_PASSWORD}
]},(error,summary)=>{
 if(error){console.error(error.message);process.exitCode=1;return;}
 // Never export the raw Newman run: it contains request credentials and cookies.
 const report={status:summary.run.failures.length?'FAIL':'PASS',requests:summary.run.stats.requests.total,assertions:summary.run.stats.assertions.total,
  failures:summary.run.failures.map(f=>({name:f.error.name,message:f.error.message})),
  checks:summary.run.executions.flatMap(e=>(e.assertions||[]).map(a=>({name:a.assertion,passed:!a.error})))};
 const output=path.resolve(__dirname,'../../../verification/postman-results.json');fs.mkdirSync(path.dirname(output),{recursive:true});fs.writeFileSync(output,JSON.stringify(report,null,2));console.log(JSON.stringify(report,null,2));
 if(report.status!=='PASS')process.exitCode=1;
});
