# AIML Assignment 1 — Web fundamentals and essentials of AI

Source: `MCWD201T-AS01 (1).docx`, Unit I, ten questions with parts (a) and (b). Each part below follows the source numbering. [Original question text](QUESTIONS.md). [Working HTML/CSS demo](../Lab-Sheet-01/) accompanies these answers. The separately supplied Lab Sheet 1 file contains these same questions.

## Q1(a) From HTML4 to semantic HTML5

Early pages commonly used tables for layout, followed by CSS layouts with generic `div` containers. HTML4 already had meaningful elements such as headings, lists and forms; HTML5 added clearer document sections. `header` introduces a page or section, `main` contains the dominant content, `article` is self-contained, `section` groups a named topic, `aside` holds complementary content and `footer` supplies closing information. CSS still determines appearance.

Semantic elements expose useful structure to assistive technology and help crawlers interpret content. Screen-reader users can navigate landmarks instead of hearing every item sequentially. Use native elements before adding ARIA. Semantics do not automatically make a page accessible, make parsing measurably faster or guarantee higher search rankings; labels, heading order, keyboard access and meaningful content still matter.

## Q1(b) HTML5 forms and validation

`email` checks a basic email shape, `url` expects a URL, `number` supports numeric input and `date` provides a date-oriented control. `required` rejects an empty value; `pattern` constrains supported text inputs; `min`, `max` and `step` constrain applicable numeric/date values. Associate a visible `label` with every input.

```html
<label for="email">Email</label>
<input id="email" name="email" type="email" required autocomplete="email">
<label for="age">Age</label>
<input id="age" name="age" type="number" min="18" max="80" required>
<label for="code">Student code</label>
<input id="code" name="code" pattern="[A-Z]{2}[0-9]{4}" required>
```

Browser checks provide immediate feedback and avoid some unnecessary invalid requests. They are a usability layer, not a security boundary: an attacker can send requests directly, so repeat validation and authorization on the server. Validation also does not prove an email address exists.

## Q2(a) CSS box model

From the inside outward, a box has content, padding, border and margin. Padding separates content from its border; margin separates the box from neighboring boxes. With `content-box`, a declared width covers only content. For width 200px, left/right padding 20px and borders 2px, the border-box width is `200 + 40 + 4 = 244px`; adding 10px horizontal margins gives 264px of horizontal space.

With `border-box`, the same declared width includes padding and border: outer border-box width is 200px, content width is 156px, and space including margins is 220px. Margin never becomes part of the declared width. `*, *::before, *::after { box-sizing: border-box; }` makes responsive sizing easier. Vertical margin collapsing is a separate behavior of some block layouts.

## Q2(b) Flexbox properties

`display: flex` creates a one-dimensional layout. `flex-direction` determines the main axis; the cross axis is perpendicular. With a row in a left-to-right writing mode, the main axis is horizontal. `justify-content` distributes remaining main-axis space, `align-items` aligns items on the cross axis and `align-self` overrides one item's cross-axis alignment.

`flex-basis` gives the initial main size; `flex-grow` distributes positive free space; `flex-shrink` controls reduction when space is insufficient, weighted by base size. `gap` creates spacing without manual margins. Enable wrapping where needed:

```css
.cards { display: flex; flex-wrap: wrap; gap: 1rem; }
.card { flex: 1 1 16rem; min-width: 0; }
```

The cards begin near 16rem, can grow or shrink, and wrap to another row. Flexbox does not automatically choose an appropriate mobile design; test long text and narrow viewports.

## Q3(a) AI, ML, deep learning and generative AI

Artificial intelligence is the broad field of systems performing tasks associated with intelligent behavior, such as planning or recognition. Machine learning is an approach within AI that learns patterns from data instead of relying only on hand-written rules. Deep learning uses multilayer neural networks. Generative AI produces new text, code, images or other outputs based on learned patterns; modern generative systems often use deep learning, but the terms are not synonyms.

In web engineering, generative AI can draft components, propose tests, explain errors and assist migrations. A classifier that labels spam is ML but need not generate content. An LLM drafting an HTML form is generative AI. Generated code still needs requirement checks, accessibility review, security review and execution tests because plausible output can be wrong.

## Q3(b) How LLMs generate code

A tokenizer converts the prompt and code into token IDs. A Transformer processes token embeddings with positional information. Self-attention allows each position to combine information from relevant context, such as the function name, imported symbols and earlier instructions. Layers transform those representations into a probability distribution over the next token. Decoding chooses a token, appends it and repeats until a stop condition or limit.

The model normally predicts tokens, not a guaranteed-correct whole line or program. Training supplies statistical knowledge of syntax and coding patterns; retrieved project files add current context. A generated function may look valid while calling a nonexistent API, because prediction is not compilation or execution. Type checking, tests and actual runtime feedback are therefore essential companions.

## Q4(a) Four parts of a developer prompt

The instruction states the task. Context describes the environment and constraints. Input data provides the material to transform. The output indicator specifies the desired artifact and format. Clear separation reduces ambiguity and helps the developer verify the result.

```text
Instruction: Build a responsive course card using semantic HTML and Flexbox.
Context: Plain HTML/CSS, no framework. Match existing CSS variables.
Input data: Course = MCA; duration = 2 years; action = View syllabus.
Output: Return card.html and card.css. Use an article, heading, paragraph
and a real link. At 320px width, text must wrap without horizontal scrolling.
Use a visible keyboard focus indicator and explain how to preview it.
```

The prompt supplies both content and measurable acceptance criteria. It avoids a vague instruction such as “make a beautiful card,” whose output cannot be assessed consistently.

## Q4(b) Zero-shot, few-shot and reasoning prompts

Zero-shot prompting gives a task without demonstrations. Few-shot prompting includes a few input/output examples that establish a pattern. A reasoning-oriented prompt asks the model to analyze constraints before answering; request a concise rationale or verification checklist rather than hidden internal reasoning. Longer explanations do not prove that an answer is correct.

For example, provide two template mappings: “news story → `article` with `h2` and paragraph” and “site links → `nav` containing a list of links.” Then ask for a course announcement using the same conventions. The examples show semantic structure and naming style more clearly than adjectives alone. Keep examples correct and varied; otherwise the model may reproduce their mistakes or overfit their exact wording.

## Q5(a) Role-based prompting

A role instruction sets the evaluation perspective, vocabulary and priorities. “Act as a senior web accessibility engineer” can direct attention toward keyboard navigation, meaningful labels, contrast, focus order and screen-reader semantics. Make the role concrete: ask for accessible alternatives and checks against acceptance criteria, rather than assuming the title creates expertise.

Security requires its own requirements, such as escaped untrusted content and server-side authorization. A role label cannot guarantee those properties, and a generated compliance claim is not an accessibility audit. For a form, ask the model to explain label associations and error announcements, then test them with the keyboard and assistive technology. Human review and real measurements determine quality.

## Q5(b) Accessibility system prompt

```text
You produce HTML/CSS targeting WCAG 2.1 Level AA. Follow these rules:
1. Use semantic landmarks, one descriptive page h1, logical heading order,
   visible labels and meaningful text alternatives. Prefer native controls.
2. Make every interaction operable by keyboard, with visible focus,
   logical focus order and no keyboard trap.
3. Meet contrast requirements: normal text >= 4.5:1, large text >= 3:1,
   and applicable UI component/state boundaries >= 3:1.
4. Support text resizing and reflow at 320 CSS pixels without loss of
   content; do not convey meaning through color alone.
5. Identify input errors in text, associate help/errors with controls,
   and announce important status updates without unexpectedly moving focus.
Return code and a test checklist. Flag unverified requirements; do not
claim full AA conformance from these five rules or automated tests alone.
```

AA requires satisfying all applicable A and AA criteria. These five grouped rules are a useful starting policy, not the complete standard. [W3C WCAG reference](https://www.w3.org/WAI/WCAG22/quickref/?versions=2.1).

## Q6(a) Semantic tags and implicit roles

| HTML element | Typical implicit role | Important qualification |
|---|---|---|
| `main` | main | Dominant page content |
| `nav` | navigation | Label multiple navigation areas distinctly |
| `aside` | complementary | Related content outside the main flow |
| Page-level `header` | banner | A nested article/section header is not automatically a banner |
| Page-level `footer` | contentinfo | A nested article/section footer is not automatically contentinfo |

Semantic structure makes navigation more efficient for users and interpretation clearer for software. This is not a promise of faster network loading or parsing. A named `section` can expose a region; an unnamed one is not automatically a navigable landmark. Avoid redundant or contradictory ARIA roles on native elements.

## Q6(b) Semantic rewrite

The source does not supply the poorly written snippet, so this is an illustrative replacement for a generic profile/contact page:

```html
<header><h1>Student portal</h1></header>
<nav aria-label="Main"><a href="#profile">Profile</a></nav>
<main id="profile">
  <section aria-labelledby="contact-title">
    <h2 id="contact-title">Contact details</h2>
    <form action="/contact" method="post">
      <label for="name">Name</label>
      <input id="name" name="name" required maxlength="80" autocomplete="name">
      <label for="contact-email">Email</label>
      <input id="contact-email" name="email" type="email" required>
      <button type="submit">Save details</button>
    </form>
  </section>
</main>
<footer><p>College student services</p></footer>
```

The backend must validate the request and apply CSRF protection; semantic markup does not replace those controls.

## Q7(a) Responsive sizing and flex shorthand

When a container changes size, Flexbox computes item base sizes and distributes available space. Positive space permits growth; negative space requires shrinking, subject to minimum sizes. Wrapping moves items to new lines when enabled. Intrinsic minimum widths can still cause overflow, so `min-width: 0` and sensible text wrapping are often necessary.

In common browsers, `flex: 1` expands to `1 1 0%`: items start from a zero basis and share free space, often giving equal widths. `flex: auto` is `1 1 auto`: the starting size comes from the declared width or content, so differing content sizes remain significant. Neither expression guarantees equal widths in every case, because min/max constraints also apply.

## Q7(b) Responsive navigation prompt

```text
Build a semantic nav with a logo link and a ul of four navigation links.
Use Flexbox, max-width 70rem, centered container and a 1rem gap.
At widths >= 48rem, use one horizontal row with links centered in the
available space. Below 48rem, stack the logo and wrapping links, keeping
all links visible. Do not add an unimplemented hamburger control.
Use tokens for color/spacing, visible :focus-visible styles, aria-current
on the active page and comfortable touch targets. Test at 320, 768 and
1280 CSS pixels, including a long link label and 200% zoom.
Return HTML/CSS and describe the breakpoint behavior.
```

## Q8(a) Temperature and top-p

Temperature changes how sharply the model favors high-probability next tokens. Lower values often make output more consistent; higher values increase variation. Top-p restricts sampling to a group of likely tokens whose cumulative probability reaches a threshold. They are decoding controls, not correctness scores.

A low temperature such as 0.0–0.2 may suit constrained code tasks; 0.7–1.0 may explore more alternatives. Low temperature can repeatedly produce the same wrong answer, while high temperature may introduce unnecessary changes. Availability and exact behavior depend on the model; some do not expose these controls. Change one setting at a time and assess compilation, tests and requirements rather than judging code by apparent confidence.

## Q8(b) Why pixel-perfect CSS is difficult

Words such as “compact” and “balanced” do not uniquely determine pixels. A model may lack the exact font metrics, browser rendering, viewport, image dimensions and hidden component states. Similar-looking layouts can also be implemented with different CSS rules. Three practical remedies are:

1. Supply exact design tokens, dimensions, breakpoints, font files and asset references.
2. Give an annotated reference image and specify component structure and responsive behavior.
3. Render in the target browser, compare screenshots, measure the mismatch and make a small targeted correction.

The feedback loop matters more than repeatedly asking for perfection. Check zoom, overflow, focus and contrast as well as visual similarity.

## Q9(a) System instructions versus user prompts

System instructions establish application-level behavior and enduring constraints; a user prompt describes the current task. For example, a system instruction might require use of existing design tokens, while the user asks for a dashboard. In systems with instruction hierarchies, lower-priority requests cannot legitimately override higher-priority rules. Exact supported roles vary by platform.

Persona is only one use of system instructions; authorization boundaries and output requirements are more important. Text retrieved from a web page, repository or document is data, not automatically an instruction with the user's authority. Do not put secrets in a system prompt or rely on prose alone to enforce tool permissions; enforce access control in application code.

## Q9(b) Progressive dashboard prompts

1. “List the profile dashboard's content: student identity, course summary and recent activity. Use synthetic data. Identify headings and landmarks.”
2. “Create semantic HTML for those sections with labels and links. Add no styling yet; preserve a logical reading order.”
3. “Define CSS variables for color, spacing and type. Apply `border-box` and readable base typography.”
4. “Use Flexbox for the sidebar/content relationship and card row. Wrap cards and prevent long names from causing overflow.”
5. “At 48rem stack the sidebar above content. Keep keyboard focus visible and all information available.”
6. “Test 320/768/1280px, 200% zoom and keyboard navigation. Report failures and show the smallest diff that fixes them.”

Review each stage before continuing; this isolates structure errors from styling errors.

## Q10(a) Block/inline layout versus Flexbox

Normal block flow places block boxes vertically; inline content flows in lines. It is ideal for paragraphs and ordinary documents. Positioning offsets elements or removes them from normal flow; floats primarily let text wrap around content. These techniques remain useful and are not obsolete.

Flexbox explicitly distributes items along one axis, supports alignment, wrapping and flexible sizing without float-clearing workarounds. It is useful for navigation, toolbars and card rows. It is less natural than CSS Grid for a strongly two-dimensional layout. Changing visual `order` does not change DOM reading or keyboard order, so keep semantic source order sensible. Use normal flow for text, Flexbox for one-dimensional relationships and Grid where both rows and columns need coordination.

## Q10(b) Learning with generative AI

AI can provide alternate explanations, practice questions, starter examples and quick feedback. Students can compare approaches and explore unfamiliar APIs with less initial friction. Risks include accepting invented facts, copying insecure patterns, losing debugging practice and being unable to explain submitted code.

A useful study routine is to attempt the problem first, request a hint, implement the solution, predict the output and then test it. Ask why an alternative fails. Rebuild the example without assistance and change one requirement. Record AI assistance honestly and follow the institution's rules. The educational goal is being able to reason about and maintain the work, rather than merely obtaining a working file.

## Revision checks

Explain a 200px border-box calculation, demonstrate keyboard-only navigation, distinguish an instruction from untrusted document text, and explain why low temperature cannot guarantee correct code.
