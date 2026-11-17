<?php
// Development server router. Only explicitly public assets bypass index.php.
$path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
if ($path === '/style.css') return false;
require __DIR__ . '/index.php';
