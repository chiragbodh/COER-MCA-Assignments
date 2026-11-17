<p>Comments are stored as text and escaped when displayed. HTML markup is never executed.</p>
<form class="panel" method="post" action="/comments"><?= csrf() ?><label for="body">Comment</label><textarea id="body" name="body" rows="4" required maxlength="1000"><?= e($old) ?></textarea><button type="submit">Add comment</button></form>
<section aria-label="Comments"><?php foreach($rows as $comment): ?><article><h2><?= e($comment['name']) ?></h2><p><?= e($comment['body']) ?></p><small><?= e($comment['created_at']) ?></small></article><?php endforeach ?></section>
