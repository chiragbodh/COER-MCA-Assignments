# Assignment 02 - Pandas, cleaning and exploratory analysis

**ERP source:** MCA209D-AS02.pdf. Printed subject code: MCA207D. Five questions; examples use illustrative application data.

## Q1. Python, Series and DataFrame

Python combines readable syntax with libraries for files, databases, statistics and visualization. Pandas provides labelled data structures and operations such as selection, grouping, joining and reshaping. These make many tabular tasks shorter and clearer than manually looping over nested lists. Vectorized operations often reduce Python-level loop overhead, but Pandas is not automatically the best choice for every scale: large-than-memory workloads may need chunking, a database or distributed processing.

A **Series** is a one-dimensional labelled array. It has values, an index, a name and a data type. An index may contain dates or meaningful labels, and arithmetic between Series usually aligns by labels rather than blindly by position. For example, two daily request-count Series can be added by date even if their row order differs. Missing labels must be handled deliberately.

A **DataFrame** is a two-dimensional table with row and column labels. Each column behaves like a Series; different columns may have different data types. A request-log frame might contain strings, UTC timestamps, integer status codes and floating-point durations. Selecting `df['status']` returns a Series, while `df[['status']]` retains a two-dimensional DataFrame. Shared indexing makes filtering and column calculations convenient. Explicitly checking `shape`, `dtypes`, unique keys and units prevents a convenient API from concealing incorrect assumptions.

## Q2. Major cleaning operations

| Operation | Example | When and why |
|---|---|---|
| Missing values | `df.isna().sum()`; `dropna(subset=['request_id'])` | Quantify missingness first. Missing identifiers may prevent safe joins. Fill only with a justified value; a missing latency is not automatically zero. |
| Duplicates | `df.drop_duplicates(subset=['request_id'])` | Removes repeated ingestion of the same event. Repeated timestamps alone are not proof of duplicates. |
| Row/column filtering | `df.loc[df['status'] >= 500, ['service','status']]` | Isolates relevant records and fields while preserving a clearly defined population. |
| Type conversion | `pd.to_numeric(..., errors='coerce')`; `pd.to_datetime(..., utc=True)` | Makes numeric comparisons and time ordering meaningful. Track values converted to missing instead of silently discarding them. |
| Standardization | `df['service'].str.strip().str.lower()` | Merges accidental spelling/case variants only when they refer to the same entity. |

Cleaning should preserve the raw input and produce an audit trail. Distinguish a genuinely absent measurement from a parse failure. Do not remove every extreme value: a latency spike could be the incident being investigated. Imputation can alter variance and correlations, and dropping missing rows can bias the result if missingness is systematic. For machine learning, estimate imputation parameters from the training split only. After each major operation, recheck row counts, ranges, category frequencies and key uniqueness. Document assumptions so another analyst can reproduce the cleaned table.

## Q3. EDA and descriptive statistics

Exploratory Data Analysis investigates structure, quality, variation and possible relationships before making strong claims. It is an iterative process of asking a question, summarizing the data, visualizing it and investigating exceptions.

The **mean**, `sum(x)/n`, describes the balance point but is sensitive to extreme values. The **median** is the middle ordered value and better represents a typical observation in a skewed latency distribution. The **mode** identifies the most frequent value or category. **Variance** measures squared deviations: population variance divides by `n`, whereas an unbiased sample-variance estimator commonly divides by `n-1`. Quartiles divide ordered values into quarters; `IQR = Q3-Q1` summarizes the middle 50% and can guide exploratory outlier checks.

For latencies `[10, 10, 20, 20, 140]` ms, the mean is 40 ms, median 20 ms and there are two modes, 10 and 20. The mean alone conceals the long tail. A histogram reveals skewness, a box plot compares groups, a line plot reveals temporal bursts, and a scatter plot can show a relationship with payload size. Numerical summaries provide exact values while plots expose shapes, clusters and unusual observations. Neither proves causation; a correlation between traffic and failures may be confounded by deployments or service mix. Report sample size and missingness alongside findings.

## Q4. End-to-end server-log workflow

1. Define the unit of analysis as one request and the goal as finding services with elevated error rate or latency. Agree on time window, time zone and the definition of failure.
2. Preserve the raw export. Record its source, export time, schema, expected servers and sampling policy. Incomplete acquisition cannot be repaired merely by cleaning.
3. Profile row counts, types, unique IDs, missing values, status distributions and duration ranges. This identifies likely issues before transformations obscure them.
4. Parse timestamps and numeric duration values. Normalize units and service names. Keep parse-failure indicators and quarantine records that cannot be interpreted safely.
5. Remove repeated event IDs according to the source's deduplication rule. Validate required fields. Flag negative durations, but investigate high positive durations rather than automatically removing them.
6. Enrich with deployment metadata using a validated join. Check that an unintended many-to-many join has not multiplied request rows.
7. Derive hour, failure indicator and payload-size bands. Aggregate request counts, failed counts, failure rate and p50/p95 latency. Keep denominators and avoid comparing groups with tiny sample sizes as if they were equally reliable.
8. Compare summaries with raw totals, plot temporal and service-level views, and inspect representative anomalous records. Save cleaned data, code, assumptions and an audit report together.

The included [clean_logs.py](clean_logs.py) demonstrates a small reproducible subset and writes a cleaning report and service summary. It deliberately records invalid rows instead of inventing measurements.

## Q5. EDA on software crash reports

Suppose each record contains an event ID, timestamp, application version, device model, operating system, error signature and session identifier. Begin by checking collection coverage and distinguishing repeated log delivery from separate crashes. Normalize versions and time zones, inspect missing fields, and avoid publishing identifying session information.

Ask: Which error signatures dominate? Did crashes increase after a release? Are particular device/OS combinations overrepresented? Is the problem widespread or concentrated in a small set of repeated failing sessions? Frequency bars show top signatures, a time series reveals spikes, and a version-by-device heatmap highlights concentrations. Compare crash counts with exposure: a version used by ten times as many sessions can have more crashes but a lower crash rate. Use `sessions with a crash / total sessions` for a session-level rate; do not mix it with crashes per session.

Stratify by release, device and time period, inspect sample size, and follow anomalies back to records. A hypothetical finding that one version has a higher rate on one OS is a debugging hypothesis, not causal proof. Check rollout cohorts, logging changes and usage patterns before attributing the difference to the release. Deliver a concise findings report, supporting charts, definitions, quality caveats and proposed follow-up checks.

## Run the cleaning example

```bash
python -m pip install pandas
python clean_logs.py
```

Expected summary: `api` has 2 valid requests, 1 failure (50%), mean latency 180 ms; `web` has 1 valid request, no failures, mean 90 ms. The audit has 6 input rows, 1 duplicate, 2 invalid rows and 3 retained rows.

References: [Pandas missing data](https://pandas.pydata.org/docs/user_guide/missing_data.html), [Pandas data structures](https://pandas.pydata.org/docs/user_guide/dsintro.html).
