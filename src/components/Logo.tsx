import { cn } from '@/lib/utils';

export function Logo({
  className,
  variant = 'light',
}: {
  className?: string;
  /** light: white text on dark | dark: navy text on light */
  variant?: 'light' | 'dark';
}) {
  const base = variant === 'light' ? 'text-white' : 'text-navy-900';
  const heart = variant === 'light' ? 'fill-cyan-400' : 'fill-cyan-500';
  return (
    <span
      className={cn('font-script leading-none inline-flex items-baseline gap-[2px] tracking-tight', base, className)}
      aria-label="6 billion for peace"
    >
      <span className="relative inline-flex items-center">
        <span aria-hidden className="text-[1.4em]">6</span>
        <svg
          aria-hidden
          viewBox="0 0 24 24"
          className={cn('absolute left-1/2 top-[57%] -translate-x-1/2 -translate-y-1/2 w-[0.55em] h-[0.55em]', heart)}
        >
          <path d="M12 21s-7.5-4.6-7.5-11.2A4.8 4.8 0 0 1 12 5.6a4.8 4.8 0 0 1 7.5 4.2C19.5 16.4 12 21 12 21z" />
        </svg>
      </span>
      <span>billion</span>
      <span>for</span>
      <span>peace</span>
    </span>
  );
}
