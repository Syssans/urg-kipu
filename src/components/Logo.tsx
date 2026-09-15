export function Logo({ className = "h-16 w-16" }: { className?: string }) {
  return (
    <svg viewBox="0 0 512 512" className={className}>
      <path d="M190 150 L190 362" stroke="#a78bfa" strokeWidth={56} strokeLinecap="round" />
      <path d="M196 256 L348 150" stroke="#a78bfa" strokeWidth={56} strokeLinecap="round" />
      <path d="M196 256 L348 362" stroke="#a78bfa" strokeWidth={56} strokeLinecap="round" />
    </svg>
  );
}
