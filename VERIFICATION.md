# Verification - 17 November 2026

## Completed checks

| Area | Result and evidence |
|---|---|
| Source coverage | Nine unique assignment folders, 50 Q1-Qn answers/tasks. Data Visualization AS03/AS04 mapped to one solution. Existing Java/MEAN lab repositories were not modified. |
| Pandas example | Executed with 6 raw rows: 1 duplicate removed, 2 invalid rows quarantined, 3 retained. API error rate 50%, Web 0%. Generated CSV/JSON results are in the assignment's output folder. |
| Node Assignment 01 | Executed ES6, synchronous, callback and async/await examples; output order matched the README. Express root endpoint returned the expected JSON. |
| React Assignment 02 | Production build passed. Headless Chrome verified increment and reset; screenshot and web-results.json saved. |
| Angular Assignment 04 | Production build passed. Browser checked directives, dynamic course route, missing course, child routes, student addition, wildcard 404, shared books, GET/POST, reload, API failure/recovery and Reports child pages. No uncaught page errors. |
| Angular lazy loading | Build produced a separate Reports chunk. Browser network verification observed that extra JavaScript request when opening Reports from Home. |
| MongoDB Assignment 05 | Integration test against a real isolated mongod process passed: student CRUD, salary sorting/aggregation, all book-store methods and duplicate ISBN, every product/task CRUD endpoint, invalid IDs/fields, malformed JSON and missing records. The actual fetch client is also executed. |

## Evidence

- [Browser check results](verification/web-results.json)
- [React counter](verification/react-counter.png)
- [Angular course details](verification/angular-course-101.png)
- [Angular shared book service](verification/angular-shared-books.png)
- [Angular API users](verification/angular-api-users.png)
- [Angular lazy Reports](verification/angular-reports.png)
- [MongoDB requests, responses and client output](MEAN-Stack/Assignment-05/evidence/integration-results.json)

## Reproduction and limits

Node 24.18.0 was used. Each JavaScript project has its own package-lock.json; install with `npm ci` from the relevant assignment folder. See each README for run commands. MongoDB tests start a temporary database, not the student's existing data. The Angular API stores sample users in memory; it is a real HTTP endpoint but is not a persistent production database.

Data Visualization is primarily a theory assignment. Its short Matplotlib and Streamlit snippets explain construction and expected behavior; they were not executed in this environment. The standalone Pandas program was executed. MongoDB Compass screenshots were not captured; equivalent database operations and results were checked programmatically.

These checks establish the behavior of this batch. They do not certify missing-source assignments, predict exam questions or bypass GitHub access restrictions. The separate printable QR sheet contains personal student details and is kept outside the source repository.
