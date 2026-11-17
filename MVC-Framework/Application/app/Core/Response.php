<?php
namespace App\Core;
class Response {
    public static function json(array $data, int $status = 200): never {
        http_response_code($status); header('Content-Type: application/json; charset=utf-8');
        echo json_encode($data, JSON_THROW_ON_ERROR | JSON_UNESCAPED_UNICODE); exit;
    }
    public static function redirect(string $path): never {
        if (!str_starts_with($path, '/') || str_starts_with($path, '//') || strpbrk($path, "\r\n"))
            throw new \InvalidArgumentException('Redirect must be a local path.');
        header('Location: ' . $path, true, 303); exit;
    }
}
