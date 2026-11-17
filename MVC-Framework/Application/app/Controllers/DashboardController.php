<?php
namespace App\Controllers;
use App\Core\{BaseController,Request};
use App\Models\{StudentModel,CourseModel,FacultyModel,DepartmentModel};
class DashboardController extends BaseController {
    public function index(Request $request): void {
        $this->view('dashboard',['title'=>'Student information dashboard','students'=>(new StudentModel())->browse([])['total'],
            'courses'=>(new CourseModel())->all(),'faculty'=>(new FacultyModel())->all(),'departments'=>(new DepartmentModel())->all()]);
    }
    public function profile(Request $request): void { $this->view('profile',['title'=>'My profile','user'=>$_SESSION['user']]); }
}
