# Assignment 04 - Angular routing, directives and services

**Source:** MCWD203T-AS04.docx. All five tasks are implemented in one college portal, with separate components/services and a lazy Reports feature. The source does not print an assignment number; 04 follows its ERP filename.

## Run

Use Node.js 24. From this folder:

```bash
npm ci
npm run api
```

In a second terminal in the same folder run `npm start`, then open **http://127.0.0.1:4200**. `npm run build` creates the production assets under `dist/portal/browser`. This is a local practice application; there are no credentials or external API accounts. Stop both terminals with Ctrl+C.

## Q1. Directives, basic and dynamic routing

Open `/courses`. `@for` displays courses and `@if` conditionally shows descriptions when Toggle descriptions is pressed. Select MCA to navigate to `/courses/101`. The details component reads `ActivatedRoute.paramMap` through `toSignal`, so changing the ID updates the view even when the component instance is reused. Unknown IDs show “Course not found.”

Source: [courses.ts](src/app/courses.ts) and [app.routes.ts](src/app/app.routes.ts). Expected output: MCA, course ID 101 and its postgraduate description. Home and Courses are basic routes; `courses/:id` is the parameterized route.

## Q2. Child routing, grouping and 404

Open `/students/list` and `/students/add`. The parent StudentsComponent renders the group navigation and a nested `router-outlet`; child components render inside it. `/students` redirects to its `list` child with `pathMatch:'full'`. Add a sample name, then visit the list to see it. Dashboard and Settings have their own routes. Visiting `/unknown` displays the custom PageNotFoundComponent because `**` is last.

Source: [pages.ts](src/app/pages.ts), [app.routes.ts](src/app/app.routes.ts). Expected output: parent heading “Students” remains visible while the child heading changes. The student service is a local demonstration store and resets on browser refresh.

## Q3. One shared BookService

Open `/books`. Add a title and author using AddBookComponent. BookListComponent immediately displays the new entry. Both components inject the same root-provided BookService; neither declares its own provider or duplicates the array. The service exposes a read-only signal and updates its private array through `addBook`.

Source: [book.service.ts](src/app/books/book.service.ts), [books.component.ts](src/app/books/books.component.ts). Expected output after adding `Angular Notes / Example Author`: a new row with that title and author, and a success message. Empty or whitespace-only fields are rejected. This demonstrates shared state, not database persistence.

## Q4. GET/POST with HttpClient

Open `/users`. UserService sends GET `/api/users`, then the component displays the returned list. Enter a sample name and a valid email to POST a new user. The UI appends the object returned by the server (including its ID), rather than inventing a successful response. Reload users fetches the saved server-side in-memory state. Restarting the API clears that demonstration state.

Source: [user.service.ts](src/app/users/user.service.ts), [users.component.ts](src/app/users/users.component.ts), [HTML template](src/app/users/users.component.html), [HTTP provider](src/main.ts), [local API](api/server.cjs). The development proxy forwards `/api` to port 4300. Change the endpoint/proxy for a different authorized API; production hosting needs an equivalent same-origin route.

The UI shows loading and saving states, disables duplicate submissions, validates the form and displays errors. To test failure handling, stop the API, click Reload users and check the error message; restart it and retry. A POST returns HTTP 201 with the new user's ID/name/email; invalid JSON or invalid fields return HTTP 400.

## Q5. Reports feature module and lazy loading

Open `/reports`, `/reports/summary` and `/reports/details`. ReportsModule declares the feature components and imports its own ReportsRoutingModule. The app-level route uses dynamic `import()` in `loadChildren`; the module is not eagerly imported by the root component. The feature parent has its own outlet and defaults to Summary.

Source: [ReportsModule](src/app/reports/reports.module.ts), [ReportsRoutingModule](src/app/reports/reports-routing.module.ts), [feature components](src/app/reports/reports.components.ts), [app routes](src/app/app.routes.ts).

To verify lazy loading: build the app, open DevTools Network with cache disabled, reload at `/`, and observe the initial JavaScript requests. Navigate to Reports and observe an additional feature chunk. Subsequent visits in the same loaded app need not fetch it again. The build output should list a lazy Reports chunk separately from the initial bundle. Angular standalone components are used for the root and ordinary pages; an NgModule is deliberately retained for Reports to demonstrate the source question.

## Evidence to capture in the lab sheet

| Question | Screenshot or output |
|---|---|
| Q1 | Course list with descriptions, then `/courses/101` |
| Q2 | Student list/add child routes and a custom 404 |
| Q3 | A newly added book visible in the other component |
| Q4 | GET list, successful POST and API error message |
| Q5 | Reports summary/details and the additional network chunk |

References: [Angular routing](https://angular.dev/guide/routing/define-routes), [HTTP requests](https://angular.dev/guide/http/making-requests), [NgModules](https://angular.dev/guide/ngmodules/overview). Actual automated verification is recorded in the repository's VERIFICATION.md.
