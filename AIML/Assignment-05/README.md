# AIML Assignment 5 — Deployment, security and responsible AI

Source: `MCWD201T-AS06 (2).docx`, printed Assignment 5, twenty questions. [Original questions](QUESTIONS.md). The source's BCA/session heading is inconsistent; numbering follows the printed assignment. Legal discussion is educational and jurisdiction-specific, checked against the cited primary materials on 17 November 2026.

## Q1. Code cleanup before deployment

Begin with passing tests and a reproducible production build. Remove abandoned code and development-only dependencies, verify configuration and analyze the emitted bundle. Tree shaking uses static module relationships to omit unused exports where side-effect analysis permits it. Dead-code elimination removes unreachable or provably unnecessary code. Minification shortens syntax and identifiers while preserving behavior. Bundling combines and/or splits modules into deployable chunks.

These processes overlap but are not identical. A side-effectful module may need to remain even if its exports are unused. Tools such as Vite, Rollup and esbuild participate in build pipelines; their exact roles depend on the project's version and configuration. Test the production artifact, not only the development server. [Vite deployment guide](https://vite.dev/guide/static-deploy).

## Q2. Logs, unused code and comments

Unused code increases download, parsing and maintenance costs. Excessive console output can add overhead and expose internal state or personal information. Remove development logging or route intentional operational events through an approved logging strategy with redaction. Do not remove useful error reporting indiscriminately.

Ordinary comments are usually omitted by minifiers, but required license notices must be retained. Comments in source files are not necessarily shipped to browsers; source maps may expose them if published. Removing comments is not a substitute for keeping secrets out of source and frontend bundles. Also avoid logging expressions with required side effects: a build transformation that removes the entire call may alter behavior. Verify emitted files and runtime behavior after cleanup.

## Q3. Relative paths and client-side routing

A URL such as `./assets/logo.png` resolves against the document's base URL. At `/`, it may resolve to `/assets/logo.png`; at a nested route such as `/students/42/`, it can resolve to `/students/42/assets/logo.png`. If the server has no asset there, the request fails. A trailing slash and any HTML `base` element also affect resolution.

Client-side navigation can make this issue appear only after a deep-link refresh or direct visit. Use build-managed asset imports or an explicitly configured base path. Test a deployed nested route rather than assuming a root-page preview proves correctness. Keep asset paths distinct from router paths and verify the browser's actual network requests when diagnosing a failure.

## Q4. Absolute paths, relative paths and base URLs

`/assets/logo.png` starts at the origin root, so it can fail when the app lives under `/portal/`. A relative path is resolved against the current document/base URL. In Vite, `import.meta.env.BASE_URL` represents the configured public base; use it for appropriate public assets, while imported source assets are normally transformed by the build.

For dynamic selection, use a controlled map such as `{logo: importedLogo, help: importedHelp}` and reject unknown keys. Do not concatenate arbitrary user input into filesystem paths or load unrestricted remote script URLs. `new URL('./logo.png', import.meta.url)` can work for statically analyzable source assets; runtime-generated arbitrary paths may not be bundled automatically. [Vite asset handling](https://vite.dev/guide/assets).

## Q5. Static cloud hosting

A build pipeline installs pinned dependencies, runs checks and generates static HTML, CSS, JavaScript and assets. A hosting service publishes these artifacts to distributed infrastructure. A CDN serves content from locations near users, reducing network distance and load on the origin. Cache headers and content-hashed filenames allow repeat requests to reuse immutable assets efficiently.

HTML often needs a different cache policy so users receive new asset references promptly. Automated previews and atomic deployments can reduce release friction, but their behavior varies by provider. Static hosting does not execute arbitrary PHP or keep database secrets safe in browser code; dynamic logic needs an appropriate backend or supported server functions. [Cloudflare Pages serving behavior](https://developers.cloudflare.com/pages/configuration/serving-pages/).

## Q6. SPA fallback rules

When a user refreshes `/courses/101`, the web server receives that path before the JavaScript router runs. A static host may search for a matching file and return 404. An SPA fallback serves the app shell (`index.html`) for application navigation routes, after which the client router renders the correct screen.

Use a rewrite where possible so the requested URL remains intact. Do not indiscriminately rewrite API calls or missing JavaScript/image files to HTML; doing so hides real errors and can cause MIME-type failures. Configure actual assets and API routes before the fallback. Also give unknown application routes a useful not-found view. Multi-page or server-rendered applications may need different routing rather than a universal SPA fallback.

## Q7. Testing screen sizes

Use browser responsive tools to change viewport width, height, pixel ratio and selected device characteristics. Test small phones, tablets, desktops, landscape orientation, long text and zoom. Emulation helps find overflow but does not perfectly reproduce every physical device, keyboard, font or browser behavior.

CSS media queries respond to viewport or environment conditions, such as `@media (min-width: 48rem)`. Container queries respond to an ancestor container's dimensions after establishing an appropriate containment context, making reusable components adapt to their actual available space. Test both the whole page and components in narrow containers. Include keyboard operation, touch targets and content reflow instead of checking only a screenshot at one popular phone size.

## Q8. Automated visual regression

A visual test opens a known page/state, captures an image and compares it with an approved baseline. A change in spacing, color, font, visibility or layout can create a diff even when functional tests still pass. This is useful after AI-generated CSS edits that accidentally affect a shared selector.

Keep browser versions, fonts, viewport, test data and animations controlled to reduce noise. Inspect differences before updating the baseline; accepting every new image defeats the test. A screenshot comparison cannot prove keyboard accessibility or correct data processing, so combine it with functional checks. [Playwright visual comparisons](https://playwright.dev/docs/test-snapshots) describes screenshot expectations and baseline management.

## Q9. CI/CD as a safety net

On a proposed change, CI can install the locked dependency graph, run unit/integration tests, check TypeScript, lint the code and build the production artifact. Tests detect specified behavior failures; type checking detects incompatible types; linting catches selected risky patterns and style issues. Required checks prevent known failures from being merged or deployed.

Each check has limits. A program can type-check while implementing the wrong rule, and a test suite can miss an untested path. Include boundary cases and security-sensitive behavior, and review generated code. Keep credentials out of untrusted build jobs, scope deployment permissions and retain a rollback path. Report actual executed checks rather than assuming a green build proves the entire product correct.

## Q10. Syntax hallucinations and package squatting

A code hallucination is plausible-looking but nonexistent or incorrect syntax, API usage or dependency information. Package squatting can involve registering a name likely to be mistyped or suggested by an AI, then publishing malicious code under it. If a developer installs a fabricated package name without checking its provenance, installation scripts or runtime imports may execute hostile code.

Verify package names through the project's official documentation and registry ownership/history. Prefer existing approved dependencies, lock versions, inspect unexpected install scripts and use dependency review/scanning. Do not install a new package merely because an assistant mentioned it. A familiar-looking name, high version number or successful installation is not proof that the package is legitimate.

## Q11. Permissive and copyleft licenses

MIT generally permits reuse and redistribution, including proprietary products, while requiring preservation of its notice. Apache 2.0 is also permissive and includes explicit patent provisions and notice-related obligations. GPLv3 generally requires covered distributed derivative works to meet its source and licensing conditions. AGPLv3 adds a source-offer requirement for users interacting remotely with a modified covered program over a network.

Copyleft does not prohibit commercial use, and using a separate GPL tool does not automatically license all unrelated software under GPL. Risk depends on the combined work, modifications and distribution/deployment facts. Review compatibility before copying code into a closed-source product. Sources: [MIT](https://opensource.org/license/mit), [Apache 2.0](https://www.apache.org/licenses/LICENSE-2.0), [GPLv3](https://opensource.org/license/gpl-3.0), [AGPLv3](https://opensource.org/license/agpl-3.0).

## Q12. Training on public open-source code

Publicly accessible code is not automatically public domain. Authors retain copyright in protected expression and grant permissions through licenses. Training raises questions about copying, license conditions, exceptions such as fair use or text/data-mining provisions, and whether generated outputs reproduce protected material. Those issues depend on jurisdiction and facts; one blanket rule does not settle every dataset or output.

Original creators do not lose their rights merely because code was visible online. At the same time, rights in source code do not necessarily grant control over every learned pattern or independently generated idea. Preserve provenance and licenses, investigate close reproductions and distinguish access terms from copyright law. The [US Copyright Office's AI materials](https://www.copyright.gov/ai/) discuss both output copyrightability and training; these are related but separate questions.

## Q13. Ownership of AI-generated code

In the United States, copyright protection requires human authorship; purely AI-generated material is not protected merely because a person supplied prompts. Human-authored expression, creative modifications or qualifying selection/arrangement may be protected, assessed case by case. Tool contracts assigning output rights do not by themselves create copyright where the law does not recognize it. [US Copyright Office report](https://www.copyright.gov/ai/).

India's Copyright Act section 2(d)(vi) addresses authorship of computer-generated literary, dramatic, musical and artistic works by referring to the person causing their creation. Applying this language to modern generative AI and satisfying originality/ownership requirements is not resolved by simply importing the US rule. [Official Indian provision](https://ipindia.gov.in/acts/copyright-act-1957/section-2-6). Keep records of human contribution, employment terms and source provenance; do not claim universal ownership rules.

## Q14. Pasting private code into cloud AI tools

Private code may contain trade secrets, security architecture, customer data or credentials. Sending it to an unapproved service can breach confidentiality commitments or data-protection obligations, and retention, logging, subprocessors or training settings may conflict with company policy. The actual risk depends on the service contract and configuration, not merely the word “cloud.”

Use an approved environment and data-processing terms, minimize the snippet, replace real identifiers and remove credentials before sharing. Check whether code leaves the device through tools as well as chat. If a secret has been exposed, follow the organization's incident process and rotate it rather than only deleting the message. Do not claim every provider trains on every prompt; verify the applicable agreement.

## Q15. AI use and academic plagiarism

Academic misconduct can include presenting another source's expression or an AI-generated submission as one's own when attribution or independent work is required. Even when copyright is not infringed, undisclosed assistance can violate assessment rules. Conversely, permitted use for explanation, brainstorming, practice or feedback may support learning when disclosed and understood.

Follow the teacher's stated rules for the specific assignment. Keep prompts or a summary of assistance, cite external sources and describe which parts were generated or revised. Verify facts and code independently, and be able to explain the result. Attribution is necessary where required but does not make prohibited assistance permissible. Never fabricate experiments, screenshots or a claim that the work was completed without help.

## Q16. AI-attribution framework

```text
Project / assignment:
Author and date:
Tool / model / version (if known):
Purpose of assistance: explanation / drafting / code / tests / editing
Scope: files, sections or questions affected
Prompt summary and relevant input sources:
AI output used, changed or rejected:
Human contribution and design decisions:
Verification performed and actual results:
External code/data sources and licenses:
Known limitations or unverified claims:
Course / organization policy checked:
```

For this repository, AI assisted drafting, implementation and verification. The student should review, understand and adapt the solutions and complete the personal/policy fields before submission. Do not claim independent authorship or instructor approval that has not occurred. A completed log is more informative than a vague statement that “AI was used.”

## Q17. Why the browser is an untrusted environment

Users can inspect downloaded JavaScript, modify requests, change local storage and bypass client-side checks. Therefore a browser cannot securely hold a shared database password, private service credential or authoritative authorization decision. Minification and obfuscation do not turn shipped code into a secret.

Keep privileged credentials and sensitive operations on a backend that authenticates the caller, checks authorization, validates inputs and limits resource use. A server proxy must not simply forward every requested operation. Public identifiers and intentionally publishable restricted keys are different from secrets, but their restrictions must be enforced server-side. Frontend validation remains useful for usability; security decisions must remain valid when the client is hostile or modified.

## Q18. Prompt leakage and indirect prompt injection

Prompt leakage exposes instructions or other context that an application intended to keep private. Indirect prompt injection occurs when an agent reads attacker-controlled content—such as a page, document or tool result—that contains commands attempting to redirect its behavior. A page could falsely claim that revealing credentials is required to finish the user's task.

The core problem is confusing source content with authorized instructions. Treat retrieved text as untrusted data, separate it from control instructions and enforce permissions independently. Do not place secrets in prompts on the assumption that a “never reveal this” sentence protects them. The [OWASP guidance](https://cheatsheetseries.owasp.org/cheatsheets/LLM_Prompt_Injection_Prevention_Cheat_Sheet.html) describes layered defenses; no single keyword filter solves the problem.

## Q19. AI application security plan

Authenticate users and apply authorization to every backend operation. Give the model only the minimum data and tools needed, isolate tenant data, and store credentials in a backend secret store. Validate structured tool arguments against strict schemas and allowlists; escape outputs for the context in which they are displayed.

Mark retrieved content as untrusted, keep its provenance, and prevent it from granting permissions. Restrict outbound destinations, scope service credentials and require explicit authorization for consequential actions. Log decisions without storing secrets, apply quotas and test malicious document/page content as well as normal prompts. Input cleaning is useful but cannot reliably remove every semantic attack. Monitor failures and keep a way to revoke credentials and disable an unsafe tool quickly.

## Q20. Ethical engineering responsibilities

Engineers remain accountable for the behavior they deploy, including generated code. Review authentication, data handling, dependencies and failure paths; provide accessible controls and content; maintain understandable code and useful tests so future developers can repair it. Disclose material AI involvement according to project and institutional requirements.

Measure performance and resource use instead of making unsupported environmental claims. Choose suitable model sizes, avoid unnecessary repeated inference, cache safe reusable results and remove wasteful computation. Balance efficiency with privacy and correctness. Consider affected users, including people with disabilities and those on limited devices or networks. A fast release is not a success if users cannot safely access, understand or rely on the application.
