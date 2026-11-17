<?php
declare(strict_types=1);
require dirname(__DIR__) . '/bootstrap.php';
use App\Core\{Request,Response,Router};
try {
    $request = new Request();
    $router = new Router();
    require ROOT . '/routes.php';
    $router->dispatch($request);
} catch (Throwable $error) {
    $status = $error instanceof App\Core\HttpException ? $error->status : 500;
    if ($status === 500) error_log('Application failure: ' . get_class($error));
    $message = $status === 500 ? 'An internal error occurred. Please try again.' : $error->getMessage();
    if (str_starts_with($_SERVER['REQUEST_URI'] ?? '', '/api/')) Response::json(['error' => $message], $status);
    http_response_code($status);
    App\Core\View::render('error', ['title' => "$status — Request could not be completed", 'message' => $message]);
}
