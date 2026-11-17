# AIML Lab Sheet 1 — Web fundamentals practical

The student identified `MCWD201T-AS01 (2).docx` as AIML Lab Sheet 1. Its extracted question text is identical to Assignment 1 (Unit I, Q1–Q10 with parts a/b). The [complete question-wise answers are maintained once in Assignment 1](../Assignment-01/README.md). This lab folder provides a runnable practical demonstration and its own lab-sheet navigation.

## Run

Open `index.html` in a modern browser, or serve this folder with `python -m http.server 8080` and visit `http://localhost:8080`. The form is a local learning demo: it validates and displays a message but does not send or persist personal data. Use synthetic values.

## Demonstrations

| Source topic | Implementation | Expected observation |
|---|---|---|
| Q1 and Q6: semantic HTML and forms | Landmarks, headings, labels, email/number/pattern validation | Invalid values prevent submission; valid data gives a status message |
| Q2: box model and Flexbox | Global border-box, wrapping nav and profile layout | Content fits at narrow widths |
| Q4–Q5: structured prompts and accessibility | The written answers plus semantic controls and visible focus | Keyboard can reach every control |
| Q7 and Q9: responsive navigation/dashboard | 48rem breakpoint and progressive section structure | Sidebar stacks on mobile |
| Q8 and Q10: evaluation and learning | Browser checks and human review instructions | Explain the CSS and repeat a change independently |
| Additional Unit II exercise | Token-based glass card and 1/2/4-column auto-fit product grid | Four cards at desktop, two at tablet, one at mobile |
| Additional Unit III exercise | Delegated button listener | Clicking a course updates a status message |

The supplementary exercises illustrate later units without duplicating their written answers. A basic browser check is not a claim of full WCAG conformance. See [verification](../../VERIFICATION.md) for checks actually performed.

## Viva practice

Explain why `border-box` excludes margins, why browser validation is insufficient for security, why a button is preferable to a clickable `div`, and why using CSS variables makes AI-generated styling easier to review.
