import { LEVEL_STYLES, type Interpretation } from "../lib/calculators/types";
import { DrugText } from "./DrugText";

export function ResultCard({ result }: { result: Interpretation }) {
  const role = result.role ?? "primary";

  if (role === "secondary") {
    return (
      <div className="page-in rounded-2xl border border-accent-2/25 bg-accent-2/5 p-4 backdrop-blur-xl">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-accent-2/70" />
          <span className="text-sm font-semibold text-accent-2">{result.title}</span>
        </div>
        {result.scoreLabel && (
          <p className="mt-2 text-xl font-bold tabular-nums text-white">{result.scoreLabel}</p>
        )}
        {result.detail && (
          <p className="mt-1.5 text-sm leading-snug text-muted">
            <DrugText text={result.detail} />
          </p>
        )}
      </div>
    );
  }

  const styles = LEVEL_STYLES[result.level];
  return (
    <div className={`page-in rounded-2xl border border-border p-4 shadow-[0_0_36px_2px] backdrop-blur-xl ${styles.bg} ring-1 ${styles.ring} ${styles.glow}`}>
      <div className="flex items-center gap-2">
        <span className={`h-2.5 w-2.5 rounded-full ${styles.dot}`} />
        <span className={`text-sm font-semibold ${styles.text}`}>{result.title}</span>
      </div>
      {result.scoreLabel && (
        <p className="mt-2 text-2xl font-bold tabular-nums text-white">{result.scoreLabel}</p>
      )}
      {result.detail && (
        <p className="mt-1.5 text-sm leading-snug text-muted">
          <DrugText text={result.detail} />
        </p>
      )}
    </div>
  );
}
