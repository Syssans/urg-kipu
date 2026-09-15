import { Header } from "../components/Header";

export function ComingSoon({ title, description }: { title: string; description: string }) {
  return (
    <div>
      <Header title={title} />
      <div className="mx-auto flex max-w-xl flex-col items-center gap-3 px-6 pb-28 pt-16 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-border bg-surface">
          <svg viewBox="0 0 24 24" fill="none" className="h-7 w-7 text-accent-2">
            <path d="M12 8v5l3 2" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth={1.8} />
          </svg>
        </div>
        <h2 className="text-lg font-semibold text-white">Bientôt disponible</h2>
        <p className="max-w-sm text-sm leading-relaxed text-muted">{description}</p>
      </div>
    </div>
  );
}
