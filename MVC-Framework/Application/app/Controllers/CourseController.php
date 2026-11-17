<?php
namespace App\Controllers;
class CourseController extends \App\Core\BaseController {
    public function index(\App\Core\Request $request): void { $this->view('courses',['title'=>'Courses','rows'=>(new \App\Models\CourseModel())->all()]); }
    public function show(\App\Core\Request $request,string $id): void {
        $course=(new \App\Models\CourseModel())->find((int)$id);
        if(!$course) throw new \App\Core\HttpException(404,'Course not found.');
        $this->view('courses',['title'=>'Course details','rows'=>[$course]]);
    }
}
