<?php
namespace App\Core;
class View {
    public static function render(string $name, array $data = []): void {
        // View names are supplied by controllers, not request data.
        if (!preg_match('~^[a-z/_-]+$~D', $name)) throw new \InvalidArgumentException('Invalid view.');
        extract($data, EXTR_SKIP);
        require ROOT . '/app/Views/partials/header.php';
        require ROOT . '/app/Views/' . $name . '.php';
        require ROOT . '/app/Views/partials/footer.php';
    }
}
