<?php
namespace App\Controllers;
use App\Core\{BaseController,Request,HttpException};
use App\Models\UserModel;
use App\Helpers\ValidationHelper as V;
class LoginController extends BaseController {
    public function create(Request $request): void { $this->view('auth/login',['title'=>'Sign in','errors'=>[],'old'=>[]]); }
    public function store(Request $request): void {
        $data=$request->input(); $email=strtolower(V::text($data,'email')); $password=is_string($data['password']??null)?$data['password']:'';
        $users=new UserModel(); $ip=$_SERVER['REMOTE_ADDR']??'unknown';
        if($users->throttled($email,$ip)) throw new HttpException(429,'Too many failed attempts. Try again in 15 minutes.');
        $user=$users->byEmail($email);
        if(!$user || !password_verify($password,$user['password_hash'])) {
            $users->recordFailure($email,$ip); http_response_code(422);
            $this->view('auth/login',['title'=>'Sign in','errors'=>['Invalid email or password.'],'old'=>['email'=>$email]]); return;
        }
        session_regenerate_id(true); $_SESSION=[];
        $_SESSION['user_id']=(int)$user['id'];
        $this->redirect('/','Signed in successfully.');
    }
    public function logout(Request $request): void {
        $_SESSION=[]; $params=session_get_cookie_params();
        setcookie(session_name(),'', ['expires'=>time()-42000,'path'=>$params['path'],'secure'=>$params['secure'],'httponly'=>true,'samesite'=>'Lax']);
        session_destroy(); \App\Core\Response::redirect('/login');
    }
}
