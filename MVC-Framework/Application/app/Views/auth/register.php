<form class="panel" method="post" action="/register"><?= csrf() ?>
<label for="name">Name</label><input id="name" name="name" required maxlength="100" autocomplete="name" value="<?= e($old['name']??'') ?>">
<label for="email">Email</label><input id="email" name="email" type="email" required maxlength="190" autocomplete="email" value="<?= e($old['email']??'') ?>">
<label for="password">Password</label><input id="password" name="password" type="password" required minlength="12" maxlength="72" autocomplete="new-password" aria-describedby="password-help"><p id="password-help">Use a unique password of 12–72 bytes; ASCII characters count as one byte.</p>
<button type="submit">Create account</button></form>
