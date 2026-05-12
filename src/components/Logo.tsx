import { cn } from '@/lib/utils';

export function Logo({
  className,
  variant = 'light',
  size = 'sm',
}: {
  className?: string;
  /** light: white text on dark | dark: navy text on light */
  variant?: 'light' | 'dark';
  /** sm header/footer · md mid · lg hero */
  size?: 'sm' | 'md' | 'lg';
}) {
  const base = variant === 'light' ? 'text-white' : 'text-navy-900';
  const heart = variant === 'light' ? 'fill-cyan-400' : 'fill-cyan-500';
  const sizeCls =
    size === 'lg' ? 'text-5xl sm:text-7xl' : size === 'md' ? 'text-4xl sm:text-5xl' : '';
  return (
    <span
      className={cn(
        'font-script leading-none inline-flex items-baseline tracking-tight',
        base,
        sizeCls,
        className,
      )}
      aria-label="6 billion for peace"
    >
      <span className="relative inline-flex items-center">
        <span aria-hidden className="text-[1.4em]">6</span>
        {/* Heart positioned INSIDE the lower loop of the "6" */}
        <svg
          aria-hidden
          viewBox="0 0 24 24"
          className={cn(
            'absolute left-[42%] top-[68%] -translate-x-1/2 -translate-y-1/2 w-[0.62em] h-[0.62em]',
            heart,
          )}
        >
          <path d="M12 20.4s-7-4.3-7-10.5A4.5 4.5 0 0 1 12 6a4.5 4.5 0 0 1 7 3.9c0 6.2-7 10.5-7 10.5z" />
        </svg>
      </span>
      <span>billionforpeace</span>
    </span>
  );
}
