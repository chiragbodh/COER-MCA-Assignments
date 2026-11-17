<?php
namespace App\Controllers;
use App\Core\{BaseController,Request};
use App\Helpers\ValidationHelper as V;
use App\Models\UserModel;
class RegistrationController extends BaseController {
    public function create(Request $request): void { $this->view('auth/register',['title'=>'Create student account','errors'=>[],'old'=>[]]); }
    public function store(Request $request): void {
        $data=$request->input(); $name=V::text($data,'name'); $email=strtolower(V::text($data,'email'));
        $password=is_string($data['password']??null)?$data['password']:''; $errors=[];
        if(strlen($name)<2 || strlen($name)>100)$errors[]='Name must contain 2–100 bytes.';
        if(!filter_var($email,FILTER_VALIDATE_EMAIL) || strlen($email)>190)$errors[]='Enter a valid email.';
        if(strlen($password)<12 || strlen($password)>72)$errors[]='Password must contain 12–72 bytes.';
        if(!$errors) try { (new UserModel())->create($name,$email,$password,'student'); }
        catch(\PDOException $e) { if($e->getCode()!=='23000')throw $e; $errors[]='Account could not be created with those details.'; }
        if($errors){http_response_code(422);$this->view('auth/register',['title'=>'Create student account','errors'=>$errors,'old'=>compact('name','email')]);return;}
        $this->redirect('/login','Account created. Sign in to continue.');
    }
}
