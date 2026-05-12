import { cn } from '@/lib/utils';

export function Logo({
  className,
  variant = 'light',
  size = 'sm',
}: {
  className?: string;
  /** light: white text on dark | dark: navy text on light */
  variant?: 'light' | 'dark';
  /** sm header/footer · lg hero */
  size?: 'sm' | 'lg';
}) {
  const base = variant === 'light' ? 'text-white' : 'text-navy-900';
  const heart = variant === 'light' ? 'fill-cyan-400' : 'fill-cyan-500';
  const sizeCls = size === 'lg' ? 'text-5xl sm:text-7xl' : '';
  return (
    <span
      className={cn(
        'font-script leading-none inline-flex items-baseline gap-[2px] tracking-tight',
        base,
        sizeCls,
        className,
      )}
      aria-label="6 billion for peace"
    >
      <span className="relative inline-flex items-center">
        <span aria-hidden className="text-[1.4em]">6</span>
        {/* heart sits INSIDE the lower loop of the "6" — matches client mockup */}
        <svg
          aria-hidden
          viewBox="0 0 32 32"
          className={cn(
            'absolute left-[44%] top-[70%] -translate-x-1/2 -translate-y-1/2 w-[0.6em] h-[0.6em]',
            heart,
          )}
        >
          <path d="M16 27.2c-1.3-1-3.2-2.7-5.1-4.8-1.9-2-3.4-4-4.5-5.9-1.1-2-1.7-3.7-1.7-5.3 0-1.9.6-3.4 1.9-4.6 1.2-1.2 2.8-1.8 4.6-1.8 1.1 0 2.2.3 3.1.8.9.5 1.6 1.2 1.7 1.9.1-.7.8-1.4 1.7-1.9.9-.5 2-.8 3.1-.8 1.8 0 3.3.6 4.6 1.8 1.2 1.2 1.9 2.8 1.9 4.6 0 1.6-.6 3.3-1.7 5.3-1.1 1.9-2.6 3.9-4.5 5.9-1.9 2-3.8 3.8-5.1 4.8z" />
        </svg>
      </span>
      <span>billionforpeace</span>
    </span>
  );
}
