# Assignment 04 - Interactive visualization

**ERP source:** MCA209D-AS05.pdf (printed Assignment 04, subject MCA207D). Five questions.

## Q1. Client-side and server-side execution

Interactive visualization connects an input event to a change in a chart or its underlying data. In a **client-side model**, code in the browser handles the event using data already delivered to it. For example, a standalone Plotly figure can zoom, display hover details and toggle traces; a standalone Bokeh document can use JavaScript callbacks. These interactions can work without a running Python server once the assets and data are loaded. They are responsive and easy to distribute, but large datasets increase download/memory costs, and any data sent to the browser is available to its user.

In a **server-side model**, an event requests work from a running application. Dash Python callbacks can query or transform data and return updated component properties. A Bokeh server can synchronize model changes with Python callbacks. Streamlit typically reruns application code in response to widget changes, while ipywidgets can communicate with a live notebook kernel. These systems support Python computation and controlled data access but require hosting, session management and consideration of network latency and concurrent users.

The categories describe execution paths, not rigid library labels. Dash supports client-side callbacks; Bokeh supports both standalone and server applications; Plotly charts can be embedded within a server application. Choose client-side handling for small, already-authorized datasets and lightweight interaction. Use server computation for expensive transformations, live database queries or data that should be aggregated before delivery. A browser-only dashboard cannot protect a secret embedded in its JavaScript.

## Q2. Interaction taxonomy and the event model

| Category | Example | Event and resulting update |
|---|---|---|
| Selection | Click a bar representing an error class | A click identifies the selected class; state changes; related charts highlight matching records. |
| Filtering | Choose a service or date range | A change event updates a predicate; recomputation produces a subset and redraws counts and charts. |
| Navigation | Pan, zoom or drill into a time period | A viewport/range event changes the visible domain, optionally requesting more detailed data. |
| Manipulation | Change aggregation from hourly to daily or swap axes | A control updates the analytical specification; a transformation and rendering step produce a new view. |

The general chain is `user action -> event payload -> state update -> computation -> visual update`. The event payload may contain a selected record ID, interval or control value. A callback should validate it, operate on the intended data, and return a predictable result. In a linked dashboard, a common state keeps charts synchronized so the table and graph describe the same subset.

Show loading and empty states, label active filters, and provide a reset action. Debounce expensive text inputs or rapid sliders. Guard against stale asynchronous responses overwriting newer selections. Preserve keyboard navigation and avoid relying exclusively on hover. Test combinations of filters, not only each control alone: a valid combination may return zero records and should display an explanatory state instead of a broken chart.

## Q3. Building an interactive Streamlit visualization

For a server-log explorer, first define the goal: compare latency for a selected service and time window. Prepare timestamp, service and duration fields with documented cleaning rules. Keep data loading separate from filtering so the expensive acquisition step can be cached appropriately. Build a service selector, apply its predicate, calculate meaningful metrics, and show a trend plus a table for exact values.

```python
# app.py; install streamlit and pandas, then: streamlit run app.py
import pandas as pd
import streamlit as st
st.title('Illustrative service-latency explorer')
df = pd.DataFrame({'hour': [9, 10, 11, 9, 10, 11],
    'service': ['API'] * 3 + ['Web'] * 3,
    'latency_ms': [120, 160, 130, 80, 100, 90]})
service = st.selectbox('Service', sorted(df['service'].unique()))
filtered = df.loc[df['service'].eq(service)].sort_values('hour')
st.caption('Synthetic data; hour is UTC and latency is milliseconds.')
if filtered.empty:
    st.info('No rows match the selection.')
else:
    st.metric('Mean latency (ms)', f"{filtered['latency_ms'].mean():.1f}")
    st.line_chart(filtered.set_index('hour')['latency_ms'])
    st.dataframe(filtered, hide_index=True)
```

The widget value determines the subset when the script executes. Sorting ensures the line follows time. The metric and chart use the same subset, preventing contradictory totals. The table supports verification. In a production version, add validated time controls, appropriate caching, authorization, and explicit missing-data handling. Test that choosing API gives a mean of about 136.7 ms, while Web gives 90 ms. These are expected values from the example, not a claim that a deployed dashboard has been inspected.

## Q4. Two application examples

**Server monitoring:** display request volume, failure rate and p95 latency over time. A time brush narrows an incident window; service and deployment filters isolate affected components; selecting an error spike updates a details table. Use server-side aggregation for large live logs and client-side zoom for already-delivered points. Include sample counts, freshness and time-zone labels. An apparent error-rate increase at low traffic should be investigated with its denominator, not treated as equivalent to a high-volume outage.

**Bug-tracker analytics:** display open issues by severity, issue age distributions and arrivals versus resolutions. Selecting a severity filters the issue table; team/release filters make the workload relevant; clicking an age band reveals overdue issues. A control can switch between counts and rates, provided the denominator is defined. Use accessible priority labels in addition to colour. Avoid interpreting the number of closed issues as a complete measure of engineering contribution because issue difficulty varies.

For both examples, choose interactions according to the user's next action. An engineer needs diagnostic detail; a lead may need a small number of trends and links to actionable records. Preserve filter state when moving between views and show the active scope prominently. Limit expensive refreshes and ensure empty data, failed requests and insufficient permission are distinguishable. Evaluate whether interactions help answer real questions rather than merely adding motion.

## Q5. Dash versus Streamlit

| Aspect | Dash | Streamlit |
|---|---|---|
| Core model | Declarative component layout connected through callbacks | Python script execution with widgets and session state |
| Update reasoning | Inputs trigger callbacks that update specified outputs; client-side callbacks are also possible | Widget interactions generally rerun code; forms, callbacks, fragments and caching can refine this behavior |
| State | Component properties plus deliberate client/server storage choices | Session state persists values across reruns for a session |
| Layout | Detailed component composition and styling | Convenient high-level layout primitives |
| Typical advantage | Explicitly coordinated, complex interactions | Rapid development of Python-centric analytical tools |
| Main caution | Callback dependencies and shared state can become complicated | Reruns can repeat expensive work or side effects unless carefully structured |

For a multi-panel incident dashboard where selecting a point must update several components independently, Dash's explicit dependencies can make control easier. For an internal exploratory tool with a few selectors and Python analyses, Streamlit can reduce setup. Neither automatically solves authentication, scalability or correctness. Avoid unsafe global mutable data shared between users; cache only what is appropriate to share and protect underlying data sources. Assess deployment requirements, accessibility, team familiarity and expected traffic. Build a small representative interaction before committing to a framework, since the best choice depends on the actual application rather than a universal speed or flexibility ranking.

References: [Dash callbacks](https://dash.plotly.com/basic-callbacks), [Streamlit execution flow](https://docs.streamlit.io/develop/api-reference/execution-flow), [Bokeh server](https://docs.bokeh.org/en/latest/docs/user_guide/server.html).
