# AIML Assignment 4 — AI workspaces and developer workflows

Source: `MCWD201T-AS05 (2).docx`, printed Assignment 4, twenty questions. [Original questions](QUESTIONS.md). The source prints an inconsistent BCA/session heading; this folder follows its printed assignment number and the student's MCA/AIML context. The mechanisms below are conceptual unless a product-specific source is cited.

## Q1. AI-native IDEs versus editors with plugins

AI-native IDEs organize core workflows around context gathering, conversational editing, multi-file changes and review. An editor extension can add completions, chat and agent functions to an existing editor. The distinction is about integration and product design, not an absolute capability boundary: plugin-based tools can also index a codebase and edit multiple files.

Compare how each tool selects context, exposes diffs, handles permissions, runs tests and integrates existing extensions. Do not assume “AI-native” means all indexing is local or that a plugin sees only one file. Current implementations differ. [Cursor documentation](https://cursor.com/docs) describes project understanding, planning, changes and review as integrated workflows.

## Q2. The agentic loop

An agent receives the objective and constraints, identifies missing information, chooses a tool, observes its result and decides the next step. For a bug fix, it may search for a symbol, read relevant files, edit a function, run a test and use the failure output to refine the patch. The loop stops when the acceptance criteria are met or a real blocker requires input.

A diff preview shows proposed or applied changes so the developer can inspect them. Tool permissions and execution controls must be enforced outside the model. A tool result, repository comment or web page is evidence, not automatic authority to change the task. Good agents keep changes focused and report what was actually verified.

## Q3. Context mapping trees

“Context Mapping Tree” is a descriptive name for a structured project overview; it is not one universally standardized IDE feature. A directory tree locates files. An abstract syntax tree represents language constructs such as declarations and calls. Symbol tables associate names with declarations and scopes. Import/export graphs connect modules and expose dependencies.

Together these structures help an agent distinguish a function definition from a similarly named string and locate callers when changing an interface. They still have limitations: dynamic imports, reflection, generated code and runtime configuration can hide relationships. Combine structural maps with textual search, type information and tests instead of treating one tree as a complete execution model.

## Q4. Dependency maps and affected components

If `formatPrice` changes its arguments, a dependency graph can identify modules that import it and components that depend on those modules. The agent should inspect direct callers first, then transitive effects, tests and public exports. Type checking can reveal invalid call sites, while behavioral tests detect changes that remain type-correct.

The graph predicts possible impact; it does not prove that every dependent component breaks. A compatible internal optimization may affect none. Conversely, serialized data, templates or dynamic lookups can be missed by static analysis. Preserve the function contract where possible, search by symbol and relevant strings, and verify representative user flows before concluding the refactor is safe.

## Q5. Project indexing and embeddings

A typical indexer scans eligible files, divides content into chunks, stores identifiers and metadata, and may compute vector embeddings for semantic retrieval. Syntax-aware chunks can preserve a function better than arbitrary fixed-length slices. Incremental indexing updates changed files using hashes or timestamps instead of recomputing everything.

The question's assumption that embeddings are always stored locally is incorrect. A tool can keep an index locally, remotely or in a hybrid arrangement. Cursor's published security description, for example, describes server-side chunking/embedding and remote vector storage. Confirm the installed product's current policy before using confidential code. Embeddings and file metadata can also be sensitive. [Cursor security](https://www.cursor.com/en/security).

## Q6. RAG inside an IDE

For “Where is login authentication handled?”, retrieval first searches relevant symbols, filenames, text and/or vectors. Candidate results might include the login route, session middleware, user model and authentication tests. The agent reads those passages and uses them as context while generating an answer with file references.

This is retrieval-augmented generation: current project evidence supplements the model's learned knowledge. Retrieval is not the same as retraining the model. A good answer distinguishes the login entry point from authorization checks and cites actual code. If search results are incomplete, the agent should inspect callers and configuration rather than inventing a module. Fresh indexes and exact searches are important after renames.

## Q7. Inline prompt shortcuts

An inline prompt lets a developer select a small region and request a local transformation without leaving the active file. For example, select a callback and ask to convert it to async/await while preserving its error behavior. The surrounding code gives focused context and the resulting patch can be reviewed immediately.

Shortcuts such as Cmd+K or Ctrl+I vary by editor, operating system, keymap and version; they are examples rather than universal commands. Inline editing is best for a well-scoped change. If the selected function has callers elsewhere, inspect those too. A convenient shortcut should reduce navigation overhead, not remove the responsibility to check the diff and execute relevant tests.

## Q8. Inline diff review

A diff displays deletions and additions, often in red and green, with line-level context. It helps a reviewer notice an accidental removed condition, changed default or unrelated formatting churn before accepting a patch. Accept/reject controls support small decisions instead of blindly replacing an entire file.

Review behavior, not color: a small green addition can introduce a serious authorization error. Inspect surrounding code, dependent files and test results. Color should be supplemented by symbols/labels for accessibility. For a large refactor, a summary is useful but does not replace the full diff. Reject or revise a patch that cannot be explained, even if it looks syntactically tidy.

## Q9. Fast code completion

Completion systems use the cursor location, nearby text and selected project context to predict a likely continuation. Low latency may come from smaller models, efficient inference, cached prefixes, speculative techniques, short output lengths and serving close to users. Suggestions can be streamed or displayed before a large answer is complete.

“Under 100 milliseconds” is an aspiration or product-specific measurement, not a universal guarantee. Network latency, model size, server load and prompt length all matter. Evaluate time to first useful suggestion and acceptance rate, not just raw token speed. Fast output that constantly inserts incorrect names or distracts the developer can reduce productivity.

## Q10. Cursor movement, tabs and nearby code

Recent edits and cursor position indicate the immediate task. Open tabs may provide related types or tests, while imports and surrounding functions reveal naming conventions and available APIs. A tool may prioritize these signals to avoid retrieving unrelated code. For example, a recently opened `User` interface can help a completion use the correct property names.

These are heuristics, and not every tool collects the same signals. An unrelated open tab can add noise; a stale edit history can point to an abandoned approach. Check what context the tool actually uses and its privacy settings. Explicit file selection is useful when the intended relationship is not obvious from editor activity.

## Q11. Autonomous multi-file composers

A multi-file composer is an agent that can coordinate a change across files: for example, add a route, controller, view and test for a new feature. It reads project conventions, proposes or applies edits and may run build commands. “Autonomous” describes the degree of workflow execution, not independent authority to do anything in the repository.

Changes should remain within the user's request and available permissions. Deleting files, changing dependencies or altering a public interface requires particular attention to impact. Keep a recoverable baseline, inspect the complete diff and validate the feature. An agent that creates many files has not necessarily built a complete or correct feature.

## Q12. Feature-building sequence

1. Define the desired behavior, constraints and acceptance examples.
2. Inspect the relevant architecture and existing tests; form a small implementation plan.
3. Select tools appropriate to missing information, such as symbol search or a test runner.
4. Edit the required files while preserving established interfaces and style.
5. Run the relevant tests, type checks and build commands.
6. Read failures, diagnose their cause and apply a focused correction.
7. Re-run affected checks, inspect the diff and report outcomes and remaining limits.

Do not repeat edits blindly when a command fails. A missing dependency, permission error and application defect require different responses. The acceptance behavior, rather than the number of completed tool calls, determines success.

## Q13. Safe multi-file refactoring

Before renaming a shared function, identify definitions, imports, exports, dynamic references, tests and documentation. Use language-aware rename tools where possible. Preserve externally consumed names or provide an intentional compatibility layer. Run type checking and behavioral tests after the change.

A database schema rename is more than a text replacement: review migrations, existing data, queries, API payloads and deployment order. Prefer a staged migration when old and new application versions may coexist. Back up relevant data and test the migration on a disposable copy. Check rollback behavior. Do not alter production data merely to make a compile error disappear. Commit focused changes so the review can distinguish structural renaming from behavior changes.

## Q14. JavaScript-to-TypeScript migration prompt

```text
Migrate this repository incrementally from JavaScript to TypeScript.
1. Inspect package scripts, runtime/module format, tests and build tooling.
2. Propose a tsconfig compatible with those tools; initially allowJs so
   unchanged files can remain. Do not change application behavior.
3. Migrate leaf utilities first, then callers; use .tsx for JSX.
4. Define types at API boundaries and narrow unknown external data.
   Avoid blanket any, ts-ignore and non-null assertions to hide errors.
5. Update imports, build/test configuration and compatible type packages.
   Respect the runtime's ESM extension rules rather than blindly using .ts.
6. Run type checks, existing tests and production build after each batch.
7. Resolve real type errors, enable stricter checks progressively, then
   remove allowJs once migration is complete. Report remaining exceptions.
Show a focused diff and preserve existing public interfaces.
```

## Q15. Git summaries and Conventional Commits

A summary tool reads staged changes, usually `git diff --cached`, and may inspect nearby context to identify intent. It proposes a concise message describing the resulting behavior. Conventional Commits use a type and optional scope, such as `fix(auth): reject expired sessions`. A breaking change must be identified explicitly when applicable.

The developer should verify that the message matches the staged patch, not unrelated unstaged work. A diff reveals changed lines but may not reveal business intent, so supply a short objective when needed. Do not claim tests passed unless they ran. Exclude secrets from commits rather than relying on a generated summary to hide them. A good message helps future readers understand why the change exists.

## Q16. AI-generated PR descriptions

A useful PR description states the original problem and new behavior, identifies important architectural or endpoint changes, and reports validation with practical limits. An assistant can assemble this from the final diff, issue context and test results, reducing repetitive writing and highlighting coordinated changes.

Review the description as carefully as code: it may invent an endpoint, omit a migration or turn a planned test into a claimed result. Keep the narrative aligned with the final patch after revisions. For example, “Login now rejects expired sessions; unit tests cover expiry and valid sessions” is useful only if both statements are supported. A lengthy file-by-file inventory is usually less helpful than a clear explanation of behavior and risk.

## Q17. Indexing performance and accuracy

Larger indexes consume disk space and embedding-generation time; maintaining them uses CPU, memory and potentially network bandwidth. Smaller chunks can improve retrieval precision but increase metadata and may lose surrounding meaning. Larger chunks preserve context but can return irrelevant material and consume more prompt tokens.

Exclude generated output, dependencies and large binaries; prioritize active modules and update incrementally. Combine lexical search with semantic retrieval and assess whether top results actually answer representative developer questions. Do not optimize only for index size or retrieval speed. Excessive exclusion can hide required code, while indexing everything can add noise and expose sensitive material. Choose a balance based on measured tasks.

## Q18. Sensitive-file indexing policy

```gitignore
# Example .cursorignore; adapt to the actual tool
.env
.env.*
!.env.example
**/*.pem
**/*.key
secrets/**
private-data/**
node_modules/**
dist/**
```

Keep example files free of real credentials. Verify the tool's indexed-file list, disable indexing where policy requires it and use approved data handling settings. Store secrets outside the workspace where possible; apply filesystem permissions, restricted tool access and secret scanning.

An ignore file is not a complete security boundary. Cursor's documentation says terminal and MCP tools can operate outside its ignore-file controls. Therefore restrict those capabilities separately and do not assume ignored files cannot be read by any agent tool. [Official ignore-file documentation](https://prod.cursor.com/docs/reference/ignore-file).

## Q19. Completion versus multi-file composition

| Aspect | Inline completion | Multi-file composer |
|---|---|---|
| Typical scope | Small continuation near cursor | Feature or refactor spanning modules |
| Developer control | Frequent small acceptance decisions | Larger plans and patches to inspect |
| Context | Nearby code plus selected references | Architecture, dependencies, tests and configuration |
| Risk | Local logic or syntax mistakes | Cross-module breakage, configuration drift and unintended scope |
| Verification | Inspect inserted code and affected behavior | Full diff, affected tests, build and integration behavior |

Neither mode is inherently safe or unsafe. Use the smallest scope that fits the task, and increase verification when the impact expands.

## Q20. Over-reliance and skill development

Repeatedly accepting setup and refactoring without understanding can weaken the developer's mental model of dependencies, execution flow and debugging. It can also produce a repository whose owner cannot maintain it after the assistant is unavailable. Conversely, guided explanations and deliberate practice can accelerate learning.

Predict a change before asking the agent to make it, explain each major diff, and implement a small variation independently. Periodically debug without AI and verify generated claims against documentation or tests. Treat the tool as assistance whose work remains reviewable. The risk is passive use, not the mere presence of automation; active questioning and independent practice preserve engineering judgment.
