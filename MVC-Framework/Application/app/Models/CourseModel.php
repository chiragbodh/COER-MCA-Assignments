<?php
namespace App\Models;
class CourseModel extends \App\Core\BaseModel {
    public function all(): array { return $this->query('SELECT * FROM courses ORDER BY id')->fetchAll(); }
    public function find(int $id): array|false { return $this->query('SELECT * FROM courses WHERE id=?',[$id])->fetch(); }
}
