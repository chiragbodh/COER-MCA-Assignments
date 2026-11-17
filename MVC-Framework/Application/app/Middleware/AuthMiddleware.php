<?php
namespace App\Middleware;
use App\Core\{Request,Response,HttpException};
use App\Models\UserModel;
class AuthMiddleware {
    public static function check(Request $request, string $rule): void {
        $user = isset($_SESSION['user_id']) ? (new UserModel())->find((int)$_SESSION['user_id']) : null;
        if (!$user) {
            unset($_SESSION['user_id']);
            if ($request->isApi()) throw new HttpException(401, 'Authentication required.');
            Response::redirect('/login');
        }
        // Reload from DB on every request so role changes are honored immediately.
        $_SESSION['user'] = ['id'=>$user['id'],'name'=>$user['name'],'email'=>$user['email'],'role'=>$user['role']];
        if ($rule !== 'auth' && !in_array($user['role'], explode(',', $rule), true)) throw new HttpException(403,'You do not have permission for this action.');
    }
}
