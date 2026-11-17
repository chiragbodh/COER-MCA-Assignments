<?php
namespace App\Models;
class DepartmentModel extends \App\Core\BaseModel {
    public function all(): array { return $this->query('SELECT * FROM departments ORDER BY id')->fetchAll(); }
}
