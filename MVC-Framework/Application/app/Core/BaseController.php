<?php
namespace App\Core;
abstract class BaseController {
    protected function view(string $name, array $data = []): void { View::render($name, $data); }
    protected function redirect(string $path, string $message = ''): never {
        if ($message !== '') $_SESSION['flash'] = $message;
        Response::redirect($path);
    }
}
