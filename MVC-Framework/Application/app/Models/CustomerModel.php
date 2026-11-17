<?php
namespace App\Models;
class CustomerModel extends \App\Core\BaseModel {
    public function all(): array { return $this->query('SELECT * FROM customers ORDER BY id DESC LIMIT 100')->fetchAll(); }
    public function create(array $data): void { $this->query('INSERT INTO customers(name,email,phone) VALUES (?,?,?)',[$data['name'],$data['email'],$data['phone']]); }
}
