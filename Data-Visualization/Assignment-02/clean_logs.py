"""Small, deterministic EDA example. All records are synthetic."""
from pathlib import Path
import json
import pandas as pd

def clean_and_summarize():
    raw = pd.DataFrame([
        ('r1', 'API ', '2026-01-01T10:00:00Z', '200', '120'),
        ('r1', 'API ', '2026-01-01T10:00:00Z', '200', '120'),
        ('r2', 'api', '2026-01-01T10:01:00Z', '500', '240'),
        ('r3', 'web', '2026-01-01T10:02:00Z', '200', '90'),
        ('r4', 'web', 'invalid', '200', '-10'),
        ('r5', 'api', '2026-01-01T10:04:00Z', 'bad', None),
    ], columns=['request_id', 'service', 'timestamp', 'status', 'latency_ms'])
    audit = {'input_rows': len(raw)}
    df = raw.drop_duplicates('request_id').copy()
    audit['duplicates_removed'] = len(raw) - len(df)
    df['service'] = df['service'].str.strip().str.lower()
    df['timestamp'] = pd.to_datetime(df['timestamp'], errors='coerce', utc=True)
    for col in ['status', 'latency_ms']:
        df[col] = pd.to_numeric(df[col], errors='coerce')
    valid = (df['timestamp'].notna() & df['status'].between(100, 599)
             & (df['status'] % 1 == 0) & df['latency_ms'].ge(0))
    rejected = df.loc[~valid].copy()
    clean = df.loc[valid].copy()
    clean['failed'] = clean['status'].ge(500)
    summary = clean.groupby('service').agg(requests=('request_id', 'size'),
        failures=('failed', 'sum'), mean_latency_ms=('latency_ms', 'mean'))
    summary['error_rate_percent'] = 100 * summary['failures'] / summary['requests']
    audit.update(invalid_rows=len(rejected), retained_rows=len(clean))
    return clean, rejected, summary, audit

if __name__ == '__main__':
    clean, rejected, summary, audit = clean_and_summarize()
    out = Path(__file__).parent / 'output'
    out.mkdir(exist_ok=True)
    clean.to_csv(out / 'clean_logs.csv', index=False)
    rejected.to_csv(out / 'rejected_rows.csv', index=False)
    summary.to_csv(out / 'service_summary.csv')
    (out / 'audit.json').write_text(json.dumps(audit, indent=2), encoding='utf-8')
    print(summary.to_string())
    print(json.dumps(audit, indent=2))
