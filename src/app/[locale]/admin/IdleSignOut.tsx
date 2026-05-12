'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createSupabaseBrowserClient } from '@/lib/supabase/client';

const IDLE_MS = 15 * 60 * 1000; // 15min sem atividade → signOut
const WARN_MS = 1 * 60 * 1000;  // aviso 1min antes

export function IdleSignOut() {
  const router = useRouter();
  const lastActivity = useRef(Date.now());
  const [warning, setWarning] = useState(false);

  useEffect(() => {
    function reset() {
      lastActivity.current = Date.now();
      setWarning(false);
    }
    const events: (keyof DocumentEventMap)[] = ['mousemove', 'keydown', 'click', 'scroll', 'touchstart'];
    for (const e of events) document.addEventListener(e, reset, { passive: true });

    const tick = setInterval(async () => {
      const elapsed = Date.now() - lastActivity.current;
      if (elapsed >= IDLE_MS) {
        clearInterval(tick);
        const supabase = createSupabaseBrowserClient();
        await supabase.auth.signOut();
        router.replace('/admin/login?reason=idle');
        router.refresh();
      } else if (elapsed >= IDLE_MS - WARN_MS) {
        setWarning(true);
      }
    }, 15_000);

    return () => {
      for (const e of events) document.removeEventListener(e, reset);
      clearInterval(tick);
    };
  }, [router]);

  if (!warning) return null;
  return (
    <div className="fixed bottom-4 left-1/2 z-50 -translate-x-1/2 rounded-full bg-amber-500 px-5 py-2 text-xs font-semibold text-white shadow-lg">
      Sua sessão vai expirar em ~1 minuto por inatividade. Mexa o mouse pra continuar.
    </div>
  );
}
