<?php
namespace App\Models;
use App\Core\BaseModel;
class StudentModel extends BaseModel {
    public function browse(array $filters): array {
        $name = is_string($filters['name']??null) ? trim($filters['name']) : '';
        $course = filter_var($filters['course_id']??0,FILTER_VALIDATE_INT) ?: 0;
        $sort = in_array($filters['sort']??'', ['name','email','id'], true) ? $filters['sort'] : 'id';
        $direction = ($filters['direction']??'') === 'desc' ? 'DESC' : 'ASC';
        $conditions = ['s.name LIKE ?']; $values = ['%'.$name.'%'];
        if ($course > 0) { $conditions[]='s.course_id = ?'; $values[]=$course; }
        $where=implode(' AND ',$conditions);
        $total=(int)$this->query("SELECT COUNT(*) FROM students s WHERE $where",$values)->fetchColumn();
        $pages=max(1,(int)ceil($total/5));
        $page=max(1,min($pages,(int)($filters['page']??1))); $offset=($page-1)*5;
        // SQL identifiers are allowlisted; limit/offset are computed integers.
        $rows=$this->query("SELECT s.*,c.name AS course FROM students s JOIN courses c ON c.id=s.course_id WHERE $where ORDER BY s.$sort $direction,s.id ASC LIMIT 5 OFFSET $offset",$values)->fetchAll();
        return compact('rows','total','pages','page');
    }
    public function find(int $id): array|false { return $this->query('SELECT * FROM students WHERE id=?',[$id])->fetch(); }
    public function create(array $data): int {
        $this->query('INSERT INTO students(name,email,course_id) VALUES (?,?,?)',[$data['name'],$data['email'],(int)$data['course_id']]);
        return (int)$this->db->lastInsertId();
    }
    public function update(int $id,array $data): void { $this->query('UPDATE students SET name=?,email=?,course_id=? WHERE id=?',[$data['name'],$data['email'],(int)$data['course_id'],$id]); }
    public function delete(int $id): void { $this->query('DELETE FROM students WHERE id=?',[$id]); }
}
