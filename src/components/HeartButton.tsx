import Link from 'next/link';
import { cn } from '@/lib/utils';

/**
 * Botão pequeno em formato de coração.
 * Interior: branco→azul. Exterior: glow verde brilhante pulsante.
 */
export function HeartButton({
  href = '#sign',
  children,
  className,
}: {
  href?: string;
  children: React.ReactNode;
  className?: string;
}) {
  const isExternal = href.startsWith('http') || href.startsWith('mailto:');
  const Component = isExternal ? 'a' : Link;

  const text = typeof children === 'string' ? children : '';
  const words = text.split(' ');
  const mid = Math.ceil(words.length / 2);
  const line1 = words.slice(0, mid).join(' ');
  const line2 = words.slice(mid).join(' ');

  return (
    <Component
      href={href}
      {...(isExternal ? { target: '_blank', rel: 'noopener' } : {})}
      className={cn('group relative inline-block', className)}
      aria-label={text}
    >
      <svg
        viewBox="0 0 220 200"
        className="heart-btn-pulse h-24 w-28 sm:h-28 sm:w-32"
        aria-hidden
      >
        <defs>
          <linearGradient id="heart-btn-fill" x1="50%" y1="0%" x2="50%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="55%" stopColor="#80E0FF" />
            <stop offset="100%" stopColor="#00BFFF" />
          </linearGradient>
        </defs>
        <path
          d="M110 184c-9-7-22-19-35-33-13-13-23-26-31-39-7-13-11-25-11-35 0-13 4-23 13-31 8-8 19-12 31-12 7 0 15 2 21 5 6 4 11 9 12 14 1-5 6-10 12-14 6-3 14-5 21-5 12 0 23 4 31 12 9 8 13 18 13 31 0 10-4 22-11 35-8 13-18 26-31 39-13 14-26 26-35 33z"
          fill="url(#heart-btn-fill)"
          stroke="#ffffff"
          strokeWidth="2.5"
        />
      </svg>
      <span className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center pb-1.5 text-center font-bold uppercase leading-tight tracking-tight text-navy-900">
        <span className="text-[8px] sm:text-[10px]">{line1}</span>
        <span className="text-[8px] sm:text-[10px]">{line2}</span>
      </span>
    </Component>
  );
}
