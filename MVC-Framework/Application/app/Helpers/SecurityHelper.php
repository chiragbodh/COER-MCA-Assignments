<?php
namespace App\Helpers;
use App\Core\{Request,HttpException};
class SecurityHelper {
    public static function escape(string $value): string { return htmlspecialchars($value, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8'); }
    public static function token(): string { return $_SESSION['_csrf'] ??= bin2hex(random_bytes(32)); }
    public static function verify(Request $request): void {
        $sent = $_SERVER['HTTP_X_CSRF_TOKEN'] ?? ($request->input()['_csrf'] ?? '');
        if (!is_string($sent) || !isset($_SESSION['_csrf']) || !hash_equals($_SESSION['_csrf'], $sent))
            throw new HttpException(403, 'Invalid CSRF token. Reload the form and try again.');
    }
    public static function upload(?array $file): ?string {
        if (!$file || ($file['error'] ?? UPLOAD_ERR_NO_FILE) === UPLOAD_ERR_NO_FILE) return null;
        if (!isset($file['tmp_name'],$file['error']) || !is_string($file['tmp_name']) || $file['error'] !== UPLOAD_ERR_OK || !is_uploaded_file($file['tmp_name']))
            throw new HttpException(422, 'Image upload failed.');
        if (filesize($file['tmp_name']) > 2 * 1024 * 1024) throw new HttpException(422, 'Image must be at most 2 MB.');
        $mime = (new \finfo(FILEINFO_MIME_TYPE))->file($file['tmp_name']);
        $allowed = ['image/png'=>'png','image/jpeg'=>'jpg','image/webp'=>'webp'];
        $dimensions = @getimagesize($file['tmp_name']);
        if (!isset($allowed[$mime]) || !$dimensions || ($dimensions['mime'] ?? '') !== $mime || $dimensions[0] > 6000 || $dimensions[1] > 6000)
            throw new HttpException(422, 'Only valid PNG, JPEG or WebP images up to 6000 pixels are allowed.');
        $name = bin2hex(random_bytes(16)) . '.' . $allowed[$mime];
        $directory = ROOT . '/storage/uploads';
        if (!is_dir($directory)) mkdir($directory, 0700, true);
        if (!move_uploaded_file($file['tmp_name'], $directory . '/' . $name)) throw new \RuntimeException('Cannot save upload.');
        return $name;
    }
}
