<?php
namespace App\Models;
class ProductModel extends \App\Core\BaseModel {
    public function all(): array { return $this->query('SELECT * FROM products ORDER BY id DESC LIMIT 100')->fetchAll(); }
    public function find(int $id): array|false { return $this->query('SELECT * FROM products WHERE id=?',[$id])->fetch(); }
    public function create(array $data,?string $image): void {
        $this->query('INSERT INTO products(name,price,quantity,image_name) VALUES (?,?,?,?)',[$data['name'],$data['price'],(int)$data['quantity'],$image]);
    }
}
