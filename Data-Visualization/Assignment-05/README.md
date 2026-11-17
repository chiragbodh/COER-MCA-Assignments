# Assignment 05 - Networks, dashboards and storytelling

**ERP source:** MCA209D-AS06.pdf (printed Assignment 05, subject MCA207D). Five questions.

## Q1. Networks, trees and hierarchies

A network consists of nodes and relationships; it may contain cycles and many-to-many connections. A rooted tree is a restricted hierarchy in which each non-root node has one parent. Choosing a representation requires understanding both the structure and the task: finding a path differs from comparing category sizes.

| Technique | Representation and application | Limitation |
|---|---|---|
| Node-link diagram | Nodes represent services and edges represent dependencies. Direction and edge weight can show call direction and volume. | Dense networks become tangled; use filtering, aggregation or a matrix for dense connectivity. Spatial proximity from a force layout is not automatically a measured distance. |
| Treemap | Nested rectangles show parent-child containment, with area proportional to a nonnegative value such as disk usage. | Compact part-to-whole overview, but similar rectangle areas are difficult to compare precisely and zero/negative sizes need special treatment. |
| Sunburst | Concentric rings show hierarchy levels and angular spans show composition. | Useful for navigation through a modest hierarchy; deep levels and small slices become hard to label. |
| Dendrogram | Branching links represent hierarchical clustering and merge structure. | Useful for groups of similar crash signatures, but the merge-height meaning depends on the distance metric and linkage rule. |

A file-system overview can use a treemap to locate large folders and a conventional expandable tree for exact paths. A microservice dependency investigation benefits from a node-link view with search and directional arrows. Always label the meaning of size, distance and colour; layout algorithms can create visually persuasive patterns that are not independent evidence of a relationship.

## Q2. Dashboard design principles

A dashboard should support a defined set of decisions at a useful level of detail. Establish a visual hierarchy: place the main question and reporting period first, then the most important indicators, followed by explanatory trends and details. Group related information through alignment and proximity. Use consistent units, category colours, time windows and definitions across panels so comparisons remain valid.

Information density is a balance. Too little context makes a large KPI ambiguous; too many small charts overwhelm the reader. Add a target, prior-period comparison and a clear denominator where appropriate. Use whitespace to separate groups, concise labels to remove ambiguity, and a details table for values that require exact reading. Avoid decorative 3D charts, unnecessary gridlines and colour schemes that encode no useful information.

Eye-flow patterns such as the Z-pattern can guide a simple left-to-right layout: an upper-left entry point, a sweep across the top, then supporting information below. They are heuristics, not universal laws. Reading direction, task, screen size and accessibility tools change navigation. Test with real tasks and keyboard/screen-reader use. Show loading, freshness, empty and error states. A visually clean dashboard is still misleading if it silently mixes daily and monthly measures or hides incomplete data.

## Q3. Data storytelling and the martini-glass structure

Data storytelling combines evidence, visual explanation and a purposeful narrative. It helps an audience understand what changed, why it matters and which action the evidence supports. A useful structure introduces context and a baseline, reveals a change or tension, examines supporting evidence, and concludes with a bounded interpretation and next step. Annotation should explain meaningful events without claiming a causal relationship that the data cannot establish.

The **martini-glass structure** begins with a tightly guided author-led sequence, like a narrow stem. The audience sees the essential context and key finding in an intentional order. It then opens into a broad reader-led exploration, like the bowl, where filters and details let users investigate related questions. For an enrollment story, first show the overall enrollment change, then the departments contributing to it, then offer a dashboard for department/year comparisons.

This combines a clear message with opportunities to verify and explore. Explain metric definitions, sources, missingness and uncertainty throughout. Avoid cherry-picking the time interval, suppressing contradictory groups or exaggerating small differences with axes. A story should distinguish “enrollment rose after the campaign” from “the campaign caused enrollment to rise.” A final recommendation might be to investigate low-conversion stages rather than asserting an unsupported cause. The narrative makes evidence understandable; it should not override evidence.

## Q4. University enrollment dashboard design

**Scenario:** a simulated university admissions office wants to identify where applications fail to convert to enrollment and whether program capacity is sufficient. Use synthetic application records containing application ID, program, cohort, application date, stage and enrollment date, plus a separate capacity table. Do not display personal student records in the overview.

| Panel | Metric/chart | Reason |
|---|---|---|
| Summary row | Applicants, offers, enrollments and enrollment conversion | Establish the reporting population; conversion is enrolled applicants divided by eligible applicants for the same cohort. |
| Trend | Weekly application and enrollment counts | Shows demand and timing; separate cohorts so late applications are not compared unfairly. |
| Program comparison | Horizontal enrolled/capacity bars | Makes underfilled or oversubscribed programs visible using aligned lengths. |
| Admissions stages | Ordered stage bars or a carefully defined funnel | Shows where counts fall; stage definitions must identify whether counts are cumulative or current. |
| Details | Program table with counts, rates and capacity | Supports exact checking and operational decisions. |

Filters include cohort, program and date range. Selecting a program updates all related panels; reset clears all selections. A caption states the current scope, refresh time and rate definitions. If a cohort has not completed admissions, label its outcomes provisional. Use colour for consistent program identity or an explicit threshold, not arbitrary decoration. Provide meaningful text summaries and a responsive layout. Test with hand-calculated sample counts, empty programs, zero capacity and zero-applicant denominators; display “not applicable” rather than a fabricated percentage when division is undefined.

## Q5. Developing a visualization project

1. **Define the problem:** identify stakeholders, the decision, constraints and success criteria. For an enrollment tracker, success might mean locating an underfilled program and verifying its figures within one minute.
2. **Acquire data:** choose authorized sources, establish coverage and data ownership, and document privacy restrictions, units and refresh cadence. Keep raw inputs reproducible.
3. **Clean and model:** validate identifiers, dates and categories; handle missingness; define cohorts, denominators and joins. Record transformations and check that joins do not inflate counts.
4. **Explore:** examine distributions, temporal patterns and group differences. Investigate anomalies, compare counts with rates, and separate hypotheses from confirmed findings.
5. **Design:** sketch views appropriate to the questions, audience and screen. Choose accessible encodings, interactions and a hierarchy that highlights important decisions.
6. **Implement:** separate acquisition, transformations and presentation. Use reusable functions, documented configuration and realistic loading/error states. Protect any credentials outside public code.
7. **Validate:** reconcile displayed totals with independently calculated values; test edge cases, filters, performance and accessibility. Observe users completing real tasks and revise confusing elements.
8. **Deliver and maintain:** provide the dashboard or report, source code, data dictionary, setup instructions, limitations and ownership. Monitor freshness and schema changes. Version meaningful changes so future comparisons remain interpretable.

The final deliverable includes both an understandable visualization and enough documentation to explain how every metric was produced. A technically correct plot that cannot support its intended decision is an incomplete project.

## Revision cues

Network = arbitrary relationships; tree = hierarchy. Node-link shows connections; treemap shows size within a hierarchy. Dashboard = recurring decisions; story = guided explanation. Validate denominators, uncertainty, accessibility and freshness.

Reference: [Segel and Heer, Narrative Visualization (2010)](https://vis.stanford.edu/papers/narrative.html).
