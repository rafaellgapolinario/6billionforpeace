import Link from 'next/link';
import { cn } from '@/lib/utils';

/**
 * Botão "Sign for peace" em formato de pequeno coração com gradiente branco→azul→verde brilhante.
 * Reutilizável em várias sections.
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
  return (
    <Component
      href={href}
      {...(isExternal ? { target: '_blank', rel: 'noopener' } : {})}
      className={cn(
        'group relative inline-flex items-center gap-3 px-7 py-3.5 text-sm font-semibold uppercase tracking-wider text-navy-900 transition-transform hover:-translate-y-0.5',
        className,
      )}
    >
      <span
        className="absolute inset-0 rounded-full shadow-lg shadow-cyan-500/30"
        style={{
          background:
            'linear-gradient(135deg, #ffffff 0%, #80E0FF 45%, #00BFFF 70%, #34D399 100%)',
        }}
        aria-hidden
      />
      <svg
        viewBox="0 0 24 24"
        className="relative h-5 w-5 fill-navy-900"
        aria-hidden
      >
        <path d="M12 20.4s-7-4.3-7-10.5A4.5 4.5 0 0 1 12 6a4.5 4.5 0 0 1 7 3.9c0 6.2-7 10.5-7 10.5z" />
      </svg>
      <span className="relative">{children}</span>
    </Component>
  );
}
