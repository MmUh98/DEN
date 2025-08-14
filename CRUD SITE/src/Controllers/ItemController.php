<?php
namespace Src\Controllers;

use Src\Models\ItemRepository;
use Src\Utils\Response;
use Src\Utils\Validator;

class ItemController
{
    public static function index(): void
    {
        $q = $_GET['q'] ?? null;
        $page = isset($_GET['page']) ? max(1, (int)$_GET['page']) : 1;
        $limit = isset($_GET['limit']) ? max(1, min(100, (int)$_GET['limit'])) : 10;
        $result = ItemRepository::findAll($q, $page, $limit);
        Response::json([
            'items' => $result['items'],
            'total' => $result['total'],
            'page' => $page,
            'limit' => $limit
        ]);
    }

    public static function show(int $id): void
    {
        $item = ItemRepository::findById($id);
        if (!$item) {
            Response::json(['error' => [
                'code' => 'NOT_FOUND',
                'message' => 'Item not found'
            ]], 404);
            return;
        }
        Response::json($item);
    }

    public static function create(): void
    {
        $data = json_decode(file_get_contents('php://input'), true) ?? $_POST;
        $errors = Validator::validateItem($data);
        if ($errors) {
            Response::json(['error' => [
                'code' => 'VALIDATION_ERROR',
                'message' => 'Invalid input',
                'details' => $errors
            ]], 422);
            return;
        }
        $item = ItemRepository::create($data['title'], $data['description'] ?? null);
        Response::json($item, 201);
    }

    public static function update(int $id): void
    {
        $data = json_decode(file_get_contents('php://input'), true) ?? $_POST;
        $item = ItemRepository::findById($id);
        if (!$item) {
            Response::json(['error' => [
                'code' => 'NOT_FOUND',
                'message' => 'Item not found'
            ]], 404);
            return;
        }
        $fields = [];
        if (isset($data['title'])) {
            $fields['title'] = $data['title'];
        }
        if (array_key_exists('description', $data)) {
            $fields['description'] = $data['description'];
        }
        $errors = Validator::validateItem($fields, true);
        if ($errors) {
            Response::json(['error' => [
                'code' => 'VALIDATION_ERROR',
                'message' => 'Invalid input',
                'details' => $errors
            ]], 422);
            return;
        }
        $updated = ItemRepository::update($id, $fields);
        Response::json($updated);
    }

    public static function delete(int $id): void
    {
        $item = ItemRepository::findById($id);
        if (!$item) {
            Response::json(['error' => [
                'code' => 'NOT_FOUND',
                'message' => 'Item not found'
            ]], 404);
            return;
        }
        ItemRepository::delete($id);
        Response::json(null, 204);
    }
}
