<?php
namespace App\Core;
class Database {
    private static ?\PDO $connection = null;
    public static function connection(): \PDO {
        return self::$connection ??= new \PDO(
            getenv('DB_DSN') ?: 'mysql:host=127.0.0.1;port=3306;dbname=mca_labs;charset=utf8mb4',
            getenv('DB_USER') ?: 'mca_app', getenv('DB_PASSWORD') ?: '',
            [\PDO::ATTR_ERRMODE => \PDO::ERRMODE_EXCEPTION, \PDO::ATTR_DEFAULT_FETCH_MODE => \PDO::FETCH_ASSOC,
             \PDO::ATTR_EMULATE_PREPARES => false]
        );
    }
}
