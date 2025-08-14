<?php
namespace Src\Utils;

class Validator
{
    /**
     * Validate item data.
     * @param array $data
     * @param bool $partial If true, only validate present fields (for update)
     * @return array<string, string> Field => error
     */
    public static function validateItem(array $data, bool $partial = false): array
    {
        $errors = [];
        if (!$partial || array_key_exists('title', $data)) {
            if (!isset($data['title']) || trim($data['title']) === '') {
                $errors['title'] = 'Title is required';
            } elseif (!is_string($data['title'])) {
                $errors['title'] = 'Title must be a string';
            } elseif (mb_strlen($data['title']) > 255) {
                $errors['title'] = 'Title must be at most 255 characters';
            }
        }
        if (array_key_exists('description', $data) && $data['description'] !== null) {
            if (!is_string($data['description'])) {
                $errors['description'] = 'Description must be a string';
            }
        }
        return $errors;
    }
}
