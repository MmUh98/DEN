<?php
namespace Src;

use Src\Controllers\ItemController;
use Src\Utils\Response;

class Router
{
    public static function dispatch(): void
    {
        $method = $_SERVER['REQUEST_METHOD'];
        $uri = strtok($_SERVER['REQUEST_URI'], '?');
        $body = file_get_contents('php://input');
        $params = [];

        // Method override for HTML forms
        if ($method === 'POST') {
            if (isset($_POST['_method'])) {
                $method = strtoupper($_POST['_method']);
            } elseif (isset($_SERVER['HTTP_X_HTTP_METHOD_OVERRIDE'])) {
                $method = strtoupper($_SERVER['HTTP_X_HTTP_METHOD_OVERRIDE']);
            }
        }

        // API routes
        if (preg_match('#^/api/items/?$#', $uri)) {
            switch ($method) {
                case 'GET':
                    ItemController::index();
                    break;
                case 'POST':
                    ItemController::create();
                    break;
                default:
                    Response::json(['error' => [
                        'code' => 'METHOD_NOT_ALLOWED',
                        'message' => 'Method not allowed'
                    ]], 405);
            }
            return;
        }

        if (preg_match('#^/api/items/(\d+)$#', $uri, $matches)) {
            $id = (int)$matches[1];
            switch ($method) {
                case 'GET':
                    ItemController::show($id);
                    break;
                case 'PUT':
                    ItemController::update($id);
                    break;
                case 'DELETE':
                    ItemController::delete($id);
                    break;
                default:
                    Response::json(['error' => [
                        'code' => 'METHOD_NOT_ALLOWED',
                        'message' => 'Method not allowed'
                    ]], 405);
            }
            return;
        }

        // 404 fallback
        Response::json(['error' => [
            'code' => 'NOT_FOUND',
            'message' => 'Not found'
        ]], 404);
    }
}
