<?php
namespace App\Controllers;
class DepartmentController extends \App\Core\BaseController {
    public function index(\App\Core\Request $request): void { $this->view('directory',['title'=>'Departments','rows'=>(new \App\Models\DepartmentModel())->all()]); }
}
