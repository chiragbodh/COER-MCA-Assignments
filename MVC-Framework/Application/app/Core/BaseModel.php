<?php
namespace App\Core;
abstract class BaseModel {
    protected \PDO $db;
    public function __construct() { $this->db = Database::connection(); }
    protected function query(string $sql, array $values = []): \PDOStatement {
        $stmt = $this->db->prepare($sql); $stmt->execute($values); return $stmt;
    }
}
