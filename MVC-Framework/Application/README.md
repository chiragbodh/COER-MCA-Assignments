# PHP MVC student management application

Runnable shared implementation for MVC Lab Sheets 1–7. It includes student/course/faculty/department modules, product and customer forms, image uploads, PDO CRUD, authentication, role checks, secure comments and a student REST API. The application uses synthetic data only.

## Requirements

- PHP 8.1 or newer with `pdo_mysql`, `fileinfo` and sessions enabled. This implementation uses PHP 8.1 features such as `never` and `array_is_list`.
- MySQL 8+ or a compatible MariaDB server; tested with PHP 8.4.27 and MariaDB 11.4.5 through PDO MySQL.
- A browser. Node.js is needed only for the optional automated verification tools, not for running the PHP application.

## Database setup

Create a new disposable database with an administrative MySQL connection or phpMyAdmin. Do not import into a database containing existing application tables.

```sql
CREATE DATABASE mca_labs CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'mca_app'@'127.0.0.1' IDENTIFIED BY 'REPLACE_WITH_A_UNIQUE_LOCAL_PASSWORD';
GRANT SELECT, INSERT, UPDATE, DELETE ON mca_labs.* TO 'mca_app'@'127.0.0.1';
```

Import [schema.sql](database/schema.sql), then [seed.sql](database/seed.sql), into `mca_labs` using the administrative connection. The application account deliberately has no schema-changing privileges. The schema creates nine tables and the seed creates seven students, three courses, two faculty members and two departments. User accounts are created separately with hashed passwords.

## Windows PowerShell startup

Open a terminal in this `Application` directory. Replace the values with your local configuration. `.env.example` documents the settings; this application **does not automatically load a .env file**.

```powershell
$env:DB_DSN = 'mysql:host=127.0.0.1;port=3306;dbname=mca_labs;charset=utf8mb4'
$env:DB_USER = 'mca_app'
$env:DB_PASSWORD = 'YOUR_LOCAL_DATABASE_PASSWORD'
$env:LAB_USER_PASSWORD = 'YOUR_UNIQUE_ACCOUNT_PASSWORD'
php database/create-user.php admin@example.test admin 'Demo Admin'
php database/create-user.php teacher@example.test teacher 'Demo Teacher'
php database/create-user.php student@example.test student 'Demo Student'
Remove-Item Env:LAB_USER_PASSWORD
php -S 127.0.0.1:8091 -t public public/router.php
```

Choose account passwords of 12–72 bytes. The script hashes them and does not print them. For the demonstration tests the three accounts share the temporary test password; use distinct passwords for any longer-lived installation. Visit `http://127.0.0.1:8091/login`. Stop the development server with Ctrl+C.

On XAMPP, use its PHP executable if PHP is not on PATH and enable `pdo_mysql`/`fileinfo` in its php.ini. For Apache, point the virtual host's document root at **Application/public**, enable `mod_rewrite` and allow the supplied `.htaccess`. Serving the entire Application folder would expose files that should remain private. The PHP development server command above avoids Apache configuration during the lab.

## Structure and request lifecycle

```text
public/index.php       Single application entry point
bootstrap.php          Autoloading, session setup and template helpers
routes.php             Trusted method/path/controller/action table
app/Core/              Router, Request, Response, Database, base classes and View
app/Middleware/        Authentication and role checks
app/Controllers/       HTML and JSON workflows
app/Models/            Prepared PDO persistence
app/Views/             Templates and shared header/footer
app/Helpers/           Validation, CSRF, escaping and upload checks
database/              Schema, synthetic seed and account provisioning
storage/               Private runtime sessions/uploads; ignored by Git
tests/                 Browser/HTTP runner and Postman collection
```

The request parser validates the route path. Router matches a configured handler, runs middleware and checks CSRF for state-changing methods. A controller validates input and calls a model. The result is rendered through common templates or returned as JSON. The controller/action are selected from the trusted route table; the application does not instantiate arbitrary class names supplied in a URL.

## Roles and routes

| Capability | Student | Teacher | Admin |
|---|---|---|---|
| Dashboard, student/course/directory/product reads | Yes | Yes | Yes |
| Profile and own comment submission | Yes | Yes | Yes |
| Create/edit students and products; customer registration | No | Yes | Yes |
| Delete students | No | No | Yes |
| Assign account roles | No public route | No public route | Local CLI administration |

Public registration always assigns the student role. Role checks run on the server for direct requests as well as browser navigation. The current role is reloaded from the database on every authenticated request.

## Student API

| Method and path | Result | Access |
|---|---|---|
| GET `/api/csrf` | Current session's CSRF token | Signed in |
| GET `/api/students` | Rows, total, page and pages | Signed in |
| GET `/api/students/{id}` | One student | Signed in |
| POST `/api/students` | Create; 201 and Location header | Teacher/admin |
| PUT `/api/students/{id}` | Update all required fields | Teacher/admin |
| DELETE `/api/students/{id}` | Delete confirmation | Admin |

Create/update JSON: `{"name":"Demo Student","email":"demo@example.test","course_id":1}`. Send the session cookie and `X-CSRF-Token` header on writes. This is a cookie-authenticated teaching API, so CSRF protection is required. Name/course filters, sorting and pagination are available on list endpoints. Errors use 400 malformed request, 401 unauthenticated, 403 denied, 404 absent, 405 wrong method, 409 conflicting data, 422 validation, 429 login throttling and 500 unexpected internal failure.

## Postman verification

Import [MVC.postman_collection.json](tests/MVC.postman_collection.json). Set `baseUrl`, `email` and `password` as **local values** for your disposable admin account. Disable automatic redirect following for the collection run so the login response can be checked as 303. Keep cookie handling enabled. Run all nine requests in order: the collection obtains login CSRF, signs in, obtains API CSRF and exercises CRUD. The generated test student is deleted at the end.

The collection can also be run through Newman using `npm run test:api` while the PHP server is running. Set `LAB_TEST_PASSWORD` and optionally `LAB_BASE_URL`/`LAB_TEST_EMAIL`. Only a redacted summary is saved; exporting a raw collection run can expose credentials and cookies.

## Optional browser/HTTP tests

```powershell
npm ci
npx playwright install chromium
$env:LAB_TEST_PASSWORD = 'THE_TEMPORARY_PASSWORD_FOR_ALL_THREE_DEMO_ACCOUNTS'
npm test
```

Stop an existing server on port 8091 before `npm test`; the runner starts and stops PHP itself, and also serves the AIML demo on port 8092. Set `PHP_BINARY` if PHP is not on PATH, and optionally `CHROME_PATH` for an installed Chromium browser. Database environment variables must remain set. Use a disposable database: the runner creates synthetic accounts, comments, customers and products, and captures screenshots under the repository's `verification` directory. It uses the three role accounts created above.

## Security and practical limits

PDO values are bound and sort identifiers are allowlisted. Dynamic HTML is escaped; CSRF protects all forms and cookie-authenticated API writes. Uploads accept checked PNG/JPEG/WebP content up to 2 MB and 6000px per dimension, use random names and stay outside public. Login rotates the session; logout destroys it. Failed logins are recorded and temporarily rate-limited.

This is a lab application, not a production service. It has no email verification, password recovery, MFA, per-student ownership policy, malware scanner or distributed rate limiter. Images are validated and served as images but not re-encoded. Production use would need HTTPS, deployment configuration, operational logging/retention, backup/restore and a broader security review. No ERP credentials, real student records or local runtime secrets belong in GitHub.

See the [seven task-wise lab reports](../) and [verification record](../../VERIFICATION.md).
