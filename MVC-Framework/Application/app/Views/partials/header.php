<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title><?= e($title??'MCA Portal') ?></title><link rel="stylesheet" href="/style.css"></head><body>
<a class="skip" href="#main">Skip to content</a>
<header><div class="brand">MCA Student Portal <small>MVC Framework Labs 1–7</small></div>
<nav aria-label="Main navigation">
<?php if(isset($_SESSION['user_id'])): ?>
<a href="/">Dashboard</a><a href="/students">Students</a><a href="/courses">Courses</a><a href="/faculty">Faculty</a><a href="/departments">Departments</a><a href="/products">Products</a>
<?php if(in_array($_SESSION['user']['role']??'',['admin','teacher'],true)): ?><a href="/customers">Customers</a><?php endif ?>
<a href="/comments">Comments</a><a href="/profile">My profile</a>
<form method="post" action="/logout"><?= csrf() ?><button type="submit">Sign out</button></form>
<?php else: ?><a href="/login">Sign in</a><a href="/register">Create account</a><?php endif ?>
</nav></header><main id="main"><h1><?= e($title??'MCA Portal') ?></h1>
<?php if(isset($_SESSION['flash'])): ?><p role="status" class="notice"><?= e($_SESSION['flash']) ?></p><?php unset($_SESSION['flash']);endif ?>
<?php if(!empty($errors)): ?><div role="alert" class="errors"><strong>Please correct the following:</strong><ul><?php foreach($errors as $error): ?><li><?= e($error) ?></li><?php endforeach ?></ul></div><?php endif ?>
