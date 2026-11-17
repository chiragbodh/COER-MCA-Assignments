<?php
namespace App\Controllers;
use App\Core\{BaseController,Request};
use App\Models\CommentModel;
use App\Helpers\ValidationHelper as V;
class CommentController extends BaseController {
    public function index(Request $request): void { $this->showForm(); }
    private function showForm(array $errors=[],string $old=''): void { $this->view('comments',['title'=>'Secure comments','errors'=>$errors,'old'=>$old,'rows'=>(new CommentModel())->all()]); }
    public function store(Request $request): void {
        $body=V::text($request->input(),'body');
        if(strlen($body)<1||strlen($body)>1000){http_response_code(422);$this->showForm(['Comment must contain 1–1000 bytes.'],$body);return;}
        (new CommentModel())->create((int)$_SESSION['user_id'],$body);$this->redirect('/comments','Comment added as plain text.');
    }
}
