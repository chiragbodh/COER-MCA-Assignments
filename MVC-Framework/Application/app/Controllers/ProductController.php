<?php
namespace App\Controllers;
use App\Core\{BaseController,Request,HttpException};
use App\Models\ProductModel;
use App\Helpers\{ValidationHelper as V,SecurityHelper};
class ProductController extends BaseController {
    public function index(Request $request): void { $this->view('products/index',['title'=>'Products','rows'=>(new ProductModel())->all()]); }
    public function create(Request $request): void { $this->form([],[]); }
    private function form(array $old,array $errors): void { $this->view('products/form',['title'=>'Register product','old'=>$old,'errors'=>$errors]); }
    public function store(Request $request): void {
        $input=$request->input();$data=['name'=>V::text($input,'name'),'price'=>V::text($input,'price'),'quantity'=>V::text($input,'quantity')];
        $errors=V::product($data);$image=null;
        if(!$errors) try{$image=SecurityHelper::upload($_FILES['image']??null);}catch(HttpException $e){$errors[]=$e->getMessage();}
        if($errors){http_response_code(422);$this->form($data,$errors);return;}
        try{(new ProductModel())->create($data,$image);}catch(\Throwable $e){if($image)unlink(ROOT.'/storage/uploads/'.$image);throw $e;}
        $this->redirect('/products','Product registered.');
    }
    public function image(Request $request,string $id): void {
        $product=(new ProductModel())->find((int)$id);$name=$product['image_name']??'';
        if(!preg_match('/^[a-f0-9]{32}\.(png|jpg|webp)$/D',$name))throw new HttpException(404,'Image not found.');
        $file=ROOT.'/storage/uploads/'.$name;
        if(!is_file($file))throw new HttpException(404,'Image not found.');
        $types=['png'=>'image/png','jpg'=>'image/jpeg','webp'=>'image/webp'];
        header('Content-Type: '.$types[pathinfo($name,PATHINFO_EXTENSION)]);
        header('Content-Disposition: inline; filename="'.$name.'"');readfile($file);
    }
}
