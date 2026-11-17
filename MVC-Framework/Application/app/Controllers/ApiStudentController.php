<?php
namespace App\Controllers;
use App\Core\{Request,Response,HttpException};
use App\Models\{StudentModel,CourseModel};
use App\Helpers\{ValidationHelper as V,SecurityHelper};
class ApiStudentController {
    public function token(Request $request): void { Response::json(['csrf_token'=>SecurityHelper::token()]); }
    public function index(Request $request): void { Response::json((new StudentModel())->browse($_GET)); }
    public function show(Request $request,string $id): void { Response::json(['student'=>$this->find($id)]); }
    private function find(string $id): array { return (new StudentModel())->find((int)$id) ?: throw new HttpException(404,'Student not found.'); }
    private function data(Request $request): array {
        $input=$request->input();$data=['name'=>V::text($input,'name'),'email'=>V::text($input,'email'),'course_id'=>$input['course_id']??null];
        $errors=V::student($data);
        if(!$errors && !(new CourseModel())->find((int)$data['course_id']))$errors[]='Course does not exist.';
        if($errors)Response::json(['errors'=>$errors],422);
        return $data;
    }
    public function store(Request $request): void {
        $data=$this->data($request);
        try{$id=(new StudentModel())->create($data);}catch(\PDOException $e){if($e->getCode()!=='23000')throw $e;throw new HttpException(409,'Student email already exists or course is invalid.');}
        header('Location: /api/students/'.$id);Response::json(['student'=>$this->find((string)$id)],201);
    }
    public function update(Request $request,string $id): void {
        $this->find($id);$data=$this->data($request);
        try{(new StudentModel())->update((int)$id,$data);}catch(\PDOException $e){if($e->getCode()!=='23000')throw $e;throw new HttpException(409,'Student email already exists or course is invalid.');}
        Response::json(['student'=>$this->find($id)]);
    }
    public function delete(Request $request,string $id): void { $this->find($id);(new StudentModel())->delete((int)$id);Response::json(['deleted'=>(int)$id]); }
}
