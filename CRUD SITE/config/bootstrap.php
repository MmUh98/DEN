<?php
declare(strict_types=1);

require_once __DIR__ . '/../vendor/autoload.php';

use Dotenv\Dotenv;

session_start();

$dotenv = Dotenv::createImmutable(dirname(__DIR__));
$dotenv->load();
