<?php
namespace App\Core;
use App\Helpers\SecurityHelper;
use App\Middleware\AuthMiddleware;
class Router {
    private array $routes = [];
    public function add(string $method, string $path, array $handler, array $middleware = []): void {
        $this->routes[] = compact('method','path','handler','middleware');
    }
    public function dispatch(Request $request): void {
        $matchedPath = false;
        foreach ($this->routes as $route) {
            $pattern = '~^' . preg_replace('/\\\{[a-z]+\\\}/', '([1-9][0-9]*)', preg_quote($route['path'], '~')) . '$~D';
            if (!preg_match($pattern, $request->path, $matches)) continue;
            $matchedPath = true;
            if ($route['method'] !== $request->method) continue;
            foreach ($route['middleware'] as $rule) AuthMiddleware::check($request, $rule);
            if (!in_array($request->method, ['GET','HEAD','OPTIONS'], true)) SecurityHelper::verify($request);
            // Class and action come from the trusted route table, never arbitrary URI input.
            [$controller, $action] = $route['handler'];
            if (!class_exists($controller) || !is_callable([new $controller(), $action]))
                throw new \LogicException('Invalid configured handler.');
            array_shift($matches);
            (new $controller())->$action($request, ...$matches);
            return;
        }
        throw new HttpException($matchedPath ? 405 : 404, $matchedPath ? 'Method not allowed.' : 'Page not found.');
    }
}
