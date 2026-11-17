<?php
namespace App\Models;
class CommentModel extends \App\Core\BaseModel {
    public function all(): array { return $this->query('SELECT c.body,c.created_at,u.name FROM comments c JOIN users u ON u.id=c.user_id ORDER BY c.id DESC LIMIT 50')->fetchAll(); }
    public function create(int $userId,string $body): void { $this->query('INSERT INTO comments(user_id,body) VALUES (?,?)',[$userId,$body]); }
}
