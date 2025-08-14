<?php
namespace Src\Utils;

class Response
{
    /**
     * Send JSON response with status and headers.
     * @param mixed $data
     * @param int $status
     */
    public static function json($data, int $status = 200): void
    {
        http_response_code($status);
        header('Content-Type: application/json; charset=utf-8');
        if ($data === null) {
            exit;
        }
        echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
        exit;
    }
}
