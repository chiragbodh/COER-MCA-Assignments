<?php
namespace App\Controllers;
class FacultyController extends \App\Core\BaseController {
    public function index(\App\Core\Request $request): void { $this->view('directory',['title'=>'Faculty','rows'=>(new \App\Models\FacultyModel())->all()]); }
}
