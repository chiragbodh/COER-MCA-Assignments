<?php
namespace App\Controllers;
use App\Core\{BaseController,Request};
use App\Models\CustomerModel;
use App\Helpers\ValidationHelper as V;
class CustomerController extends BaseController {
    public function index(Request $request): void { $this->form([],[]); }
    private function form(array $old,array $errors): void { $this->view('customers',['title'=>'Customer registration','old'=>$old,'errors'=>$errors,'rows'=>(new CustomerModel())->all()]); }
    public function store(Request $request): void {
        $input=$request->input();$data=[];foreach(['name','email','phone'] as $key)$data[$key]=V::text($input,$key);$errors=[];
        if(strlen($data['name'])<2||strlen($data['name'])>100)$errors[]='Name must contain 2–100 bytes.';
        if(!filter_var($data['email'],FILTER_VALIDATE_EMAIL)||strlen($data['email'])>190)$errors[]='Enter a valid email.';
        if(!preg_match('/^\+?[0-9 -]{7,20}$/D',$data['phone']))$errors[]='Enter a valid phone number.';
        if(!$errors)try{(new CustomerModel())->create($data);}catch(\PDOException $e){if($e->getCode()!=='23000')throw $e;$errors[]='Customer email already exists.';}
        if($errors){http_response_code(422);$this->form($data,$errors);return;}
        $this->redirect('/customers','Customer registered.');
    }
}
