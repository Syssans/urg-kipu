import { useNavigate } from "react-router-dom";

export function Header({ title, back }: { title: string; back?: boolean }) {
  const navigate = useNavigate();
  return (
    <header className="safe-top sticky top-0 z-30 border-b border-border bg-bg/95 backdrop-blur">
      <div className="mx-auto flex max-w-xl items-center gap-3 px-4 py-3.5">
        {back && (
          <button
            onClick={() => navigate(-1)}
            aria-label="Retour"
            className="-ml-1 flex h-8 w-8 items-center justify-center rounded-full text-slate-300 active:bg-surface-2"
          >
            <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
              <path d="m15 5-7 7 7 7" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        )}
        <h1 className="truncate text-[17px] font-semibold text-white">{title}</h1>
      </div>
    </header>
  );
}
