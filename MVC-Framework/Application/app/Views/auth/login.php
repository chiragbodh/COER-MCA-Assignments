<form class="panel" method="post" action="/login"><?= csrf() ?>
<label for="email">Email</label><input id="email" name="email" type="email" maxlength="190" autocomplete="username" required value="<?= e($old['email']??'') ?>">
<label for="password">Password</label><input id="password" name="password" type="password" autocomplete="current-password" required>
<button type="submit">Sign in</button><p><a href="/register">Create a student account</a></p></form>
