import { cn } from '@/lib/utils';

/**
 * Marca registrada do projeto — PNG transparente (gerada pelo cliente)
 * com "6+coração integrado" cursivo azul + "billionforpeace" branco.
 * Foi processada com fundo navy removido pra superpor sobre qualquer fundo escuro.
 */
export function Logo({
  className,
  size = 'sm',
}: {
  className?: string;
  /** sm header/footer · md mid · lg hero */
  size?: 'sm' | 'md' | 'lg';
  /** mantido por compatibilidade; agora a logo tem cores fixas */
  variant?: 'light' | 'dark';
}) {
  const sizeCls =
    size === 'lg'
      ? 'h-16 sm:h-24'
      : size === 'md'
        ? 'h-12 sm:h-16'
        : 'h-8 sm:h-10';
  return (
    <img
      src="/logo.png"
      srcSet="/logo.png 1x, /logo@2x.png 2x"
      alt="6billionforpeace"
      className={cn('w-auto select-none', sizeCls, className)}
      draggable={false}
    />
  );
}
