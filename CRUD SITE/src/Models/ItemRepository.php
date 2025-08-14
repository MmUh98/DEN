<?php
namespace Src\Models;

use PDO;

class ItemRepository
{
    /**
     * @return array{items: array, total: int}
     */
    public static function findAll(?string $search = null, int $page = 1, int $limit = 10): array
    {
        $pdo = DB::get();
        $offset = max(0, ($page - 1) * $limit);
        $params = [];
        $where = '';
        if ($search) {
            $where = 'WHERE title LIKE :search';
            $params[':search'] = '%' . $search . '%';
        }
        $sql = "SELECT SQL_CALC_FOUND_ROWS * FROM items $where ORDER BY created_at DESC LIMIT :limit OFFSET :offset";
        $stmt = $pdo->prepare($sql);
        if ($search) {
            $stmt->bindValue(':search', $params[':search'], PDO::PARAM_STR);
        }
        $stmt->bindValue(':limit', $limit, PDO::PARAM_INT);
        $stmt->bindValue(':offset', $offset, PDO::PARAM_INT);
        $stmt->execute();
        $items = $stmt->fetchAll();

        $total = (int)$pdo->query('SELECT FOUND_ROWS()')->fetchColumn();

        return ['items' => $items, 'total' => $total];
    }

    public static function findById(int $id): ?array
    {
        $pdo = DB::get();
        $stmt = $pdo->prepare('SELECT * FROM items WHERE id = :id');
        $stmt->execute([':id' => $id]);
        $item = $stmt->fetch();
        return $item ?: null;
    }

    public static function create(string $title, ?string $description): array
    {
        $pdo = DB::get();
        $stmt = $pdo->prepare('INSERT INTO items (title, description) VALUES (:title, :description)');
        $stmt->execute([
            ':title' => $title,
            ':description' => $description
        ]);
        $id = (int)$pdo->lastInsertId();
        return self::findById($id);
    }

    public static function update(int $id, array $fields): ?array
    {
        $pdo = DB::get();
        $sets = [];
        $params = [':id' => $id];
        if (isset($fields['title'])) {
            $sets[] = 'title = :title';
            $params[':title'] = $fields['title'];
        }
        if (array_key_exists('description', $fields)) {
            $sets[] = 'description = :description';
            $params[':description'] = $fields['description'];
        }
        if (!$sets) {
            return self::findById($id);
        }
        $sql = 'UPDATE items SET ' . implode(', ', $sets) . ', updated_at = CURRENT_TIMESTAMP WHERE id = :id';
        $stmt = $pdo->prepare($sql);
        $stmt->execute($params);
        return self::findById($id);
    }

    public static function delete(int $id): bool
    {
        $pdo = DB::get();
        $stmt = $pdo->prepare('DELETE FROM items WHERE id = :id');
        $stmt->execute([':id' => $id]);
        return $stmt->rowCount() > 0;
    }
}
