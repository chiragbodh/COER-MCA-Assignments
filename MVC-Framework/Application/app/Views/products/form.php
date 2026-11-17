<form class="panel" method="post" action="/products" enctype="multipart/form-data"><?= csrf() ?>
<label for="name">Product name</label><input id="name" name="name" required minlength="2" maxlength="100" value="<?= e($old['name']??'') ?>">
<label for="price">Price</label><input id="price" name="price" type="number" min="0.01" max="99999999.99" step="0.01" required value="<?= e($old['price']??'') ?>">
<label for="quantity">Quantity</label><input id="quantity" name="quantity" type="number" min="0" max="1000000" step="1" required value="<?= e($old['quantity']??'') ?>">
<label for="image">Product image (optional)</label><input id="image" name="image" type="file" accept="image/png,image/jpeg,image/webp" aria-describedby="image-help"><p id="image-help">PNG, JPEG or WebP; maximum 2 MB and 6000 pixels per dimension. Reselect the image after a validation error.</p>
<button type="submit">Register product</button></form>
