<?php
// CLI-only account creation; privileged roles are never accepted from public registration.
if(PHP_SAPI!=='cli'){http_response_code(404);exit;}
require dirname(__DIR__).'/bootstrap.php';
$email=$argv[1]??'';$role=$argv[2]??'student';$name=$argv[3]??'Lab User';$password=getenv('LAB_USER_PASSWORD')?:'';
if(!filter_var($email,FILTER_VALIDATE_EMAIL)||strlen($email)>190||!in_array($role,['admin','teacher','student'],true)||strlen($password)<12||strlen($password)>72||strlen($name)<2||strlen($name)>100){fwrite(STDERR,"Usage: set LAB_USER_PASSWORD (12–72 bytes), then php database/create-user.php email role name\n");exit(1);}
try{(new App\Models\UserModel())->create($name,$email,$password,$role);echo "Account created. Password was hashed and is not printed.\n";}
catch(Throwable){fwrite(STDERR,"Account creation failed. Check database configuration and duplicate email.\n");exit(1);}
