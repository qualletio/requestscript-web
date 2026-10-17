interface LogoProps {
  className?: string;
  title?: string;
}

/** The RequestScript mark: a "send" prompt in a rounded tile. */
export function Logo({ className, title = 'RequestScript' }: LogoProps) {
  return (
    <svg className={className} viewBox="0 0 32 32" {...(title ? { role: 'img', 'aria-label': title } : { 'aria-hidden': true })}>
      <rect width="32" height="32" rx="8" fill="var(--accent)" />
      <path
        d="M9 10.5 15 16l-6 5.5"
        fill="none"
        stroke="var(--on-accent)"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <rect x="17" y="20" width="7" height="3" rx="1.5" fill="var(--on-accent)" />
    </svg>
  );
}
