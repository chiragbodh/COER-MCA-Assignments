<?php
namespace App\Helpers;
class ValidationHelper {
    public static function text(array $data, string $key): string { return is_string($data[$key] ?? null) ? trim($data[$key]) : ''; }
    public static function student(array $data): array {
        $errors = [];
        $name = self::text($data,'name'); $email = self::text($data,'email');
        if (strlen($name) < 2 || strlen($name) > 100) $errors[] = 'Name must contain 2–100 bytes.';
        if (!filter_var($email,FILTER_VALIDATE_EMAIL) || strlen($email)>190) $errors[] = 'Enter a valid email address.';
        if (!filter_var($data['course_id'] ?? null,FILTER_VALIDATE_INT,['options'=>['min_range'=>1]])) $errors[] = 'Choose a valid course.';
        return $errors;
    }
    public static function product(array $data): array {
        $errors=[]; $name=self::text($data,'name'); $price=self::text($data,'price');
        if(strlen($name)<2 || strlen($name)>100) $errors[]='Product name must contain 2–100 bytes.';
        if(!preg_match('/^\d{1,8}(\.\d{1,2})?$/D',$price) || (float)$price<=0) $errors[]='Price must be positive with at most two decimal places.';
        if(filter_var($data['quantity']??null,FILTER_VALIDATE_INT,['options'=>['min_range'=>0,'max_range'=>1000000]])===false) $errors[]='Quantity must be an integer from 0 to 1000000.';
        return $errors;
    }
}
