<form class="panel" method="post" action="<?= isset($old['id'])?'/students/'.e($old['id']).'/update':'/students' ?>"><?= csrf() ?>
<label for="name">Name</label><input id="name" name="name" required minlength="2" maxlength="100" value="<?= e($old['name']??'') ?>">
<label for="email">Email</label><input id="email" name="email" type="email" required maxlength="190" value="<?= e($old['email']??'') ?>">
<label for="course_id">Course</label><select id="course_id" name="course_id" required><option value="">Choose course</option><?php foreach($courses as $course): ?><option value="<?= e($course['id']) ?>" <?= (string)($old['course_id']??'')===(string)$course['id']?'selected':'' ?>><?= e($course['name']) ?></option><?php endforeach ?></select>
<button type="submit">Save student</button><a href="/students">Cancel</a></form>
