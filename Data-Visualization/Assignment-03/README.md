# Assignment 03 - Statistical charts and visual encodings

**ERP sources:** MCA209D-AS03.pdf and MCA209D-AS04.pdf contain the same five questions. This single solution set covers both entries; it is not counted twice. Printed subject code: MCA207D.

## Q1. Figure and Axes architecture in Matplotlib

A **Figure** is the overall drawing container, including its size, background and possible multiple subplots. An **Axes** is a plotting region inside it, with its own data coordinates, labels, title and plotted artists. The word Axes is the class name even for a single plot. An **Axis** is a different object: it handles an individual coordinate axis, including ticks and tick labels. This distinction helps organize complex figures without accidentally modifying the wrong subplot.

```python
import matplotlib.pyplot as plt
fig, axes = plt.subplots(1, 3, figsize=(12, 3), layout='constrained')
axes[0].bar(['API', 'Web'], [12, 7], color=['#176b87', '#9bbec8'])
axes[0].set(title='Failures by service', ylabel='Failed requests')
axes[1].plot([9, 10, 11], [120, 160, 130], marker='o', label='API')
axes[1].set(title='Hourly latency', xlabel='Hour (UTC)', ylabel='Latency (ms)')
axes[1].legend()
axes[2].scatter([1, 2, 4, 8], [90, 120, 180, 300], alpha=0.8)
axes[2].set(title='Payload and latency', xlabel='Payload (KB)', ylabel='Latency (ms)')
for ax in axes:
    ax.grid(axis='y', alpha=0.2)
    ax.set_axisbelow(True)
fig.savefig('service_charts.png', dpi=180)
```

Bars compare categorical quantities using aligned lengths; use a zero baseline for ordinary magnitude comparisons. Lines connect ordered observations and are appropriate for time, not arbitrary category order. Scatter plots show paired numerical observations and can reveal association, clusters or outliers. Customize labels and units first, then colours, marker styles, line styles, gridlines and legends. Use transparency for overlapping points and avoid excessive series. Figure-level control helps set consistent dimensions and export a publication-quality image; Axes-level control keeps each subplot's meaning explicit. The snippet is an illustrative example; run it after installing Matplotlib.

## Q2. Seaborn for statistical visualization

Seaborn builds statistical plotting abstractions on top of Matplotlib. It can map DataFrame column names to visual roles, split data into groups, and produce faceted comparisons with less repetitive setup. Matplotlib remains useful for detailed adjustments. Automatic summaries still need inspection: an attractive default does not establish that the estimator, uncertainty interval or grouping is appropriate.

| Plot | What it shows | Best use and limitation |
|---|---|---|
| Box plot | Median, quartiles, whiskers and points beyond the whiskers | Compare latency distributions across services; the default whisker convention is not the minimum/maximum and flagged points are not automatically errors. |
| Violin plot | A smoothed estimate of distribution density | Reveal multimodality or asymmetric distributions; bandwidth and small samples can produce misleading shapes. Add counts or observations. |
| Pair plot | Pairwise relationships between numerical variables and marginal distributions | Explore relationships among CPU, memory, traffic and latency; many variables produce a crowded matrix and correlation does not imply causation. |
| Heatmap | Matrix values encoded by colour | Show a correlation matrix or version/device failure rates; use a meaningful colour scale and include numeric labels when exact values matter. |

For example, a box plot can show that two services have similar medians but very different tails. A violin plot can reveal that one service's requests form two latency groups. A scatter or pair plot can suggest whether payload size explains those groups. Verify sample size, preprocessing and units before interpreting the patterns. Seaborn supports exploration well, while lower-level Matplotlib control is useful for a precisely specified final layout.

## Q3. Encoding and perceptual accuracy

An encoding maps a data attribute to a visual property. Position can represent time or value, colour hue can identify categories, luminance can represent ordered magnitude, and area can represent an additional quantity. The encoding must preserve the semantics of the variable: a rainbow sequence does not naturally establish an order, and a numeric category code should not automatically be plotted as a continuous quantity.

Cleveland and McGill's graphical-perception work found that quantitative judgments are generally more accurate with position on a common scale than with encodings such as angle or area. A practical, approximate ordering is common-scale position, nonaligned position/length, then angle/slope and area, with volume and colour intensity generally less suitable for precise comparisons. This is a design guide, not an absolute ranking for every task and display.

To compare course enrollment precisely, use aligned bars or dots rather than similarly sized pie sectors. To show geographical coverage, a map may be useful even though it is weaker for exact ranking; provide a companion table or bar chart. If bubble area represents enrollment, calculate radius proportional to the square root of enrollment. Doubling radius quadruples area and would exaggerate the quantity. Use sequential colour for ordered values, diverging colour only when a meaningful midpoint exists, and categorical colour for distinct groups. Combine colour with labels or shapes for accessibility. Prefer simple encodings for the main comparison and use additional channels only when they answer an additional question.

## Q4. Multiple views with different libraries

Begin with a single cleaned dataset and explicitly defined metrics. Build a Matplotlib chart, a Seaborn view and a Plotly view using the same filters, units, aggregation and category order. Otherwise differences in preprocessing can be mistaken for differences in visualization. For server logs, use Matplotlib for a carefully annotated hourly trend, Seaborn for service-level latency distributions, and Plotly for a hoverable scatter plot with service filters.

| Library | Strength | Trade-off |
|---|---|---|
| Matplotlib | Fine control over static layout, annotations and export | Requires more explicit setup for grouped statistical summaries and complex interaction |
| Seaborn | Concise statistical grouping, distributions and faceting | Defaults may summarize data in ways that must be understood; highly unusual layouts need lower-level control |
| Plotly | Browser interaction, hover details, zoom and portable HTML figures | Larger output and browser rendering cost; meaningful server-side recomputation needs an application layer |

Compare the views against concrete tasks: finding an incident time, comparing variability, or inspecting a single request. Export a static figure for printing and an interactive version for exploration. Check that tooltips disclose units and that important findings remain visible without interaction. A second library does not automatically create a second insight; the value comes from a complementary analytical view. Document consistent data definitions, package versions and rendering choices so that results can be reproduced.

## Q5. Chart critique and redesign

Consider the GitHub contribution calendar as a real application visualization. Its compact daily grid is appropriate for spotting activity gaps and repeated patterns, but intensity bins make exact comparisons difficult. A viewer may wrongly infer that one dark cell represents proportionally more work or that a sparse calendar means little progress. Colour alone is insufficient for users who cannot distinguish nearby shades. There is no numeric bar baseline to truncate in this chart; its main issue is the interpretation of the encoding and metric, not an invented scale defect.

For an assignment-progress use case, retain the calendar as a secondary overview and make a **completed assignments by week** bar chart the primary chart. Use a zero baseline, one accessible colour, an explicit definition of completion and direct values. Add a table listing the assignment, subject, completion date and repository link. An optional stacked bar can distinguish newly completed work from revisions, but must not imply that all assignments required equal effort.

This redesign matches the question “what was completed, and when?” more closely than a contribution count. Avoid decorative 3D effects, gradients unrelated to value, and unsupported productivity rankings. Include text summaries and focusable interactive elements. Validate the redesign by asking a student or teacher to locate a specific completed assignment and compare two weeks without consulting the source code.

## Revision cues and references

Figure = container; Axes = plotting area; Axis = coordinate axis. Box plots summarize; violin plots estimate shape. Position is strong for exact comparisons. Choose complementary views, not decorative duplication.

- [Matplotlib Figure architecture](https://matplotlib.org/stable/users/explain/figure/figure_intro.html)
- [Seaborn tutorial](https://seaborn.pydata.org/tutorial.html)
- [Cleveland and McGill, Graphical Perception (1984)](https://doi.org/10.1080/01621459.1984.10478080)
- [Plotly Python](https://plotly.com/python/)
