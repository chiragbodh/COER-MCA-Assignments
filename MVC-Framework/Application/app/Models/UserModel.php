<?php
namespace App\Models;
class UserModel extends \App\Core\BaseModel {
    public function find(int $id): array|false { return $this->query('SELECT id,name,email,role FROM users WHERE id=?',[$id])->fetch(); }
    public function byEmail(string $email): array|false { return $this->query('SELECT * FROM users WHERE email=?',[$email])->fetch(); }
    public function create(string $name,string $email,string $password,string $role='student'): int {
        if(!in_array($role,['admin','teacher','student'],true)) throw new \InvalidArgumentException('Invalid role.');
        $this->query('INSERT INTO users(name,email,password_hash,role) VALUES (?,?,?,?)',[$name,$email,password_hash($password,PASSWORD_DEFAULT),$role]);
        return (int)$this->db->lastInsertId();
    }
    public function recordFailure(string $email,string $ip): void {
        $this->query('INSERT INTO failed_logins(email,ip_address) VALUES (?,?)',[substr($email,0,190),substr($ip,0,45)]);
    }
    public function throttled(string $email,string $ip): bool {
        return (int)$this->query('SELECT COUNT(*) FROM failed_logins WHERE (email=? OR ip_address=?) AND attempted_at > DATE_SUB(NOW(), INTERVAL 15 MINUTE)',[$email,$ip])->fetchColumn()>=5;
    }
}
