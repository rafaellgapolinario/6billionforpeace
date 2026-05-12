import Link from 'next/link';
import { cn } from '@/lib/utils';

/**
 * Botão em FORMATO de coração (não retangular). Gradient branco → azul → verde brilhante.
 * Texto em 2 linhas dentro do coração.
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

  // Texto vem como 1 string tipo "Sign for peace" — quebra em 2 linhas pra caber no coração
  const text = typeof children === 'string' ? children : '';
  const words = text.split(' ');
  const line1 = words.slice(0, Math.ceil(words.length / 2)).join(' ');
  const line2 = words.slice(Math.ceil(words.length / 2)).join(' ');

  return (
    <Component
      href={href}
      {...(isExternal ? { target: '_blank', rel: 'noopener' } : {})}
      className={cn(
        'group relative inline-block transition-transform hover:-translate-y-1 hover:scale-105',
        className,
      )}
      aria-label={text}
    >
      <svg
        viewBox="0 0 220 200"
        className="h-36 w-40 drop-shadow-[0_10px_24px_rgba(0,0,0,0.2)] sm:h-44 sm:w-48"
        aria-hidden
      >
        <defs>
          <linearGradient id="heart-btn-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="35%" stopColor="#80E0FF" />
            <stop offset="65%" stopColor="#00BFFF" />
            <stop offset="100%" stopColor="#34D399" />
          </linearGradient>
        </defs>
        <path
          d="M110 184c-9-7-22-19-35-33-13-13-23-26-31-39-7-13-11-25-11-35 0-13 4-23 13-31 8-8 19-12 31-12 7 0 15 2 21 5 6 4 11 9 12 14 1-5 6-10 12-14 6-3 14-5 21-5 12 0 23 4 31 12 9 8 13 18 13 31 0 10-4 22-11 35-8 13-18 26-31 39-13 14-26 26-35 33z"
          fill="url(#heart-btn-grad)"
          stroke="#ffffff"
          strokeWidth="2"
        />
      </svg>
      <span className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center pb-3 text-center font-bold uppercase tracking-wider text-navy-900">
        <span className="text-sm sm:text-base">{line1}</span>
        <span className="text-sm sm:text-base">{line2}</span>
      </span>
    </Component>
  );
}
