<?php
namespace App\Controllers;
use App\Core\{BaseController,Request,HttpException};
use App\Models\{StudentModel,CourseModel};
use App\Helpers\ValidationHelper as V;
class StudentController extends BaseController {
    public function index(Request $request): void { $this->view('students/index',['title'=>'Students','result'=>(new StudentModel())->browse($_GET),'courses'=>(new CourseModel())->all()]); }
    public function show(Request $request,string $id): void { $this->view('students/show',['title'=>'Student details','student'=>$this->find($id)]); }
    private function find(string $id): array { return (new StudentModel())->find((int)$id) ?: throw new HttpException(404,'Student not found.'); }
    public function create(Request $request): void { $this->form([]); }
    public function edit(Request $request,string $id): void { $this->form($this->find($id)); }
    private function form(array $old,array $errors=[]): void { $this->view('students/form',['title'=>isset($old['id'])?'Edit student':'Create student','old'=>$old,'errors'=>$errors,'courses'=>(new CourseModel())->all()]); }
    public function store(Request $request): void { $this->save($request); }
    public function update(Request $request,string $id): void { $this->find($id); $this->save($request,(int)$id); }
    private function save(Request $request,?int $id=null): void {
        $input=$request->input(); $data=['name'=>V::text($input,'name'),'email'=>V::text($input,'email'),'course_id'=>V::text($input,'course_id')];
        $errors=V::student($data);
        if(!$errors && !(new CourseModel())->find((int)$data['course_id'])) $errors[]='Course does not exist.';
        if(!$errors) {
            try { $model=new StudentModel(); $id ? $model->update($id,$data) : $model->create($data); }
            catch(\PDOException $e) { if($e->getCode()!=='23000') throw $e; $errors[]='Email is already registered or course is invalid.'; }
        }
        if($errors) { http_response_code(422); if($id)$data['id']=$id; $this->form($data,$errors); return; }
        $this->redirect('/students','Student saved successfully.');
    }
    public function delete(Request $request,string $id): void { $this->find($id); (new StudentModel())->delete((int)$id); $this->redirect('/students','Student deleted.'); }
}
