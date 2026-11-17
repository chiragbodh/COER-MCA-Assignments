# Verification record

Checked on 17 November 2026 using synthetic local data. GitHub hosts the source and QR links, not a live PHP server.

## MVC

- All 51 PHP files passed php -l on PHP 8.4.27.
- Schema/seed imported into isolated MariaDB 11.4.5; queries used real PDO MySQL with a restricted SELECT/INSERT/UPDATE/DELETE account.
- Sixteen browser/HTTP check groups passed: module/routing navigation, student CRUD, search/filter/sort/pagination, form validation/preserved values, valid upload and fake-image rejection, customers, login/session rotation, roles, logout, XSS escaping, CSRF rejection and REST CRUD/error paths.
- Four extra security checks passed: attempted admin-role registration ignored, new account remains a student, HttpOnly/SameSite cookie flags, five recorded login failures followed by HTTP 429.
- Postman collection executed through Newman 6.2.3: 9 requests, 9 assertions, zero failures. The Postman desktop UI was not used.
- Actual browser screenshots were captured and visually inspected.

Reports: [integration](verification/hemendra-results.json), [security](verification/security-results.json), [Postman](verification/postman-results.json). [Reproduction instructions](MVC-Framework/Application/README.md).

## AIML

- Five assignments map to 100 unique question-parts: Unit I–III Q1(a) through Q10(b), then Q1–Q20 for Assignments 4–5.
- Node assertions passed for event-loop order, value semantics, equality/defaults, total cost 350, five error categories, finally behavior and listener cleanup.
- Practical page checked at 375/768/1280px: 1/2/4 grid columns, no horizontal overflow, delegated events and HTML validation. No page errors recorded.
- AIML Lab Sheet 1 matches Assignment 1; answers are shared rather than copied.
- Prompt examples are educational artifacts, not claims that a separate AI service was run. Accessibility examples are not a full WCAG audit; legal answers identify jurisdiction and primary sources.

## Data Visualization

Assignment 2 Pandas execution: six input rows, one duplicate, two invalid and three retained. API error rate 50%; web 0%. Audit/CSV outputs are included. AS03/AS04 share one solution. Illustrative chart snippets were not all executed.

## QR and publication

The PDF follows the supplied reference layout. Every PNG QR and every rendered PDF-page QR is decoded and matched to its intended GitHub folder. Targets have completed README files and are checked in the published Git tree. Existing MEAN/Java and unavailable assignments are excluded. Personal roll details remain in the local print PDF.

## Limits

Classroom application, not production-certified. Database verification used MariaDB's MySQL-compatible interface, not an Oracle MySQL server. No full accessibility, penetration or load audit was performed. Tests create synthetic records in a disposable database. Optional Node verification dependencies include upstream deprecation notices; they are not PHP runtime dependencies.
