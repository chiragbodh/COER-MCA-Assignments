<?php
namespace App\Core;
class Request {
    public string $path;
    public string $method;
    private ?array $body = null;
    public function __construct() {
        $raw = parse_url($_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH);
        if (!is_string($raw) || preg_match('/%(?:2f|5c|00)/i', $raw)) throw new HttpException(400, 'Invalid route.');
        $path = rawurldecode($raw);
        if (!preg_match('~^/[A-Za-z0-9/_-]*$~D', $path)) throw new HttpException(400, 'Invalid route.');
        $this->path = rtrim($path, '/') ?: '/';
        $this->method = strtoupper($_SERVER['REQUEST_METHOD'] ?? 'GET');
    }
    public function input(): array {
        if ($this->body !== null) return $this->body;
        if (str_contains($_SERVER['CONTENT_TYPE'] ?? '', 'application/json')) {
            try { $data = json_decode(file_get_contents('php://input'), true, 64, JSON_THROW_ON_ERROR); }
            catch (\JsonException) { throw new HttpException(400, 'Invalid JSON body.'); }
            if (!is_array($data) || array_is_list($data)) throw new HttpException(400, 'Expected a JSON object.');
            return $this->body = $data;
        }
        return $this->body = $_POST;
    }
    public function isApi(): bool { return str_starts_with($this->path, '/api/'); }
}
