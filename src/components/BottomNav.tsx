import { NavLink } from "react-router-dom";

const items = [
  { to: "/", label: "Accueil", icon: HomeIcon, end: true },
  { to: "/scores", label: "Scores", icon: CalcIcon },
  { to: "/calcul", label: "Calcul", icon: ConvertIcon },
  { to: "/arbres", label: "Arbres", icon: TreeIcon },
  { to: "/favoris", label: "Favoris", icon: StarIcon },
];

export function BottomNav() {
  return (
    <nav className="shrink-0 px-3 pb-[calc(env(safe-area-inset-bottom)+0.75rem)]">
      <div className="mx-auto flex max-w-xl items-stretch justify-between gap-1 rounded-full border border-white/10 bg-surface/70 p-1.5 shadow-[0_8px_30px_rgba(0,0,0,0.5)] backdrop-blur-xl">
        {items.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              `flex flex-1 flex-col items-center gap-0.5 rounded-full py-2 text-[11px] font-medium transition-colors duration-150 ${
                isActive ? "bg-accent-2/15 text-accent-2" : "text-muted"
              }`
            }
          >
            <item.icon className="h-5 w-5" />
            {item.label}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}

function HomeIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <path d="M4 11.5 12 4l8 7.5" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M6 10v9a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1v-9" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function CalcIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <rect x="5" y="3" width="14" height="18" rx="2" stroke="currentColor" strokeWidth={1.8} />
      <path d="M8 7h8M8 11h2M12 11h2M16 11h0M8 14.5h2M12 14.5h2M16 14.5h0M8 18h2M12 18h2M16 18h0" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" />
    </svg>
  );
}
function ConvertIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <path d="M6 8h11.5M17.5 8 14 4.5M17.5 8 14 11.5" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M18 16H6.5M6.5 16 10 12.5M6.5 16 10 19.5" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function TreeIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <circle cx="6" cy="6" r="2.2" stroke="currentColor" strokeWidth={1.8} />
      <circle cx="18" cy="6" r="2.2" stroke="currentColor" strokeWidth={1.8} />
      <circle cx="12" cy="18" r="2.2" stroke="currentColor" strokeWidth={1.8} />
      <path d="M12 15.8V11m0 0H6.5M12 11h5.5M6 8.2V11m12-2.8V11" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" />
    </svg>
  );
}
function StarIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <path
        d="m12 3.5 2.6 5.4 5.9.8-4.3 4.2 1 5.9-5.2-2.8-5.2 2.8 1-5.9-4.3-4.2 5.9-.8Z"
        stroke="currentColor"
        strokeWidth={1.8}
        strokeLinejoin="round"
      />
    </svg>
  );
}
