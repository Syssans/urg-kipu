import { LEVEL_STYLES, type Interpretation } from "../lib/calculators/types";

export function ResultCard({ result }: { result: Interpretation }) {
  const styles = LEVEL_STYLES[result.level];
  return (
    <div className={`rounded-2xl border border-border p-4 ${styles.bg} ring-1 ${styles.ring}`}>
      <div className="flex items-center gap-2">
        <span className={`h-2.5 w-2.5 rounded-full ${styles.dot}`} />
        <span className={`text-sm font-semibold ${styles.text}`}>{result.title}</span>
      </div>
      {result.scoreLabel && (
        <p className="mt-2 text-2xl font-bold tabular-nums text-white">{result.scoreLabel}</p>
      )}
      {result.detail && <p className="mt-1.5 text-sm leading-snug text-muted">{result.detail}</p>}
    </div>
  );
}
