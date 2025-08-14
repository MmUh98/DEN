<?php
declare(strict_types=1);

require_once __DIR__ . '/../config/bootstrap.php';

use Src\Utils\Response;
use Src\Router;

// CORS for API (adjust Origin as needed)
if (preg_match('#^/api/#', $_SERVER['REQUEST_URI'])) {
    header('Access-Control-Allow-Origin: ' . ($_ENV['APP_ENV'] === 'production' ? 'https://yourdomain.com' : '*'));
    header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type, X-CSRF-Token, X-HTTP-Method-Override');
    if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
        http_response_code(204);
        exit;
    }
}

// CSRF for state-changing requests from frontend
if (preg_match('#^/api/#', $_SERVER['REQUEST_URI']) && in_array($_SERVER['REQUEST_METHOD'], ['POST', 'PUT', 'DELETE'])) {
    $origin = $_SERVER['HTTP_ORIGIN'] ?? '';
    if ($origin && parse_url($origin, PHP_URL_HOST) === $_SERVER['HTTP_HOST']) {
        Src\Middleware\Csrf::check();
    }
}

try {
    Router::dispatch();
} catch (Throwable $e) {
    Response::json([
        'error' => [
            'code' => 'SERVER_ERROR',
            'message' => ($_ENV['APP_ENV'] === 'production' ? 'Internal server error' : $e->getMessage())
        ]
    ], 500);
}
