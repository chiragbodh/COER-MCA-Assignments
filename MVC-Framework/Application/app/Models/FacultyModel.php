<?php
namespace App\Models;
class FacultyModel extends \App\Core\BaseModel {
    public function all(): array { return $this->query('SELECT f.name,f.email,d.name AS department FROM faculty f JOIN departments d ON d.id=f.department_id ORDER BY f.id')->fetchAll(); }
}
