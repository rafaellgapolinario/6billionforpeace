'use client';

import { useState } from 'react';
import { SignaturesPanel } from './SignaturesPanel';
import { SettingsPanel } from './SettingsPanel';

type Tab = 'signatures' | 'settings';

export function AdminShell({
  session,
}: {
  session: { userId: string; email: string; role: 'admin' | 'owner' };
}) {
  const [tab, setTab] = useState<Tab>('signatures');

  return (
    <>
      <nav className="border-b border-navy-100 bg-white">
        <div className="mx-auto flex max-w-6xl gap-6 px-6">
          <TabBtn active={tab === 'signatures'} onClick={() => setTab('signatures')}>
            Assinaturas
          </TabBtn>
          <TabBtn active={tab === 'settings'} onClick={() => setTab('settings')}>
            Configurações
          </TabBtn>
        </div>
      </nav>
      <section className="mx-auto max-w-6xl px-6 py-10">
        {tab === 'signatures' ? <SignaturesPanel /> : <SettingsPanel session={session} />}
      </section>
    </>
  );
}

function TabBtn({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`-mb-px border-b-2 py-3 text-sm font-medium transition ${
        active
          ? 'border-cyan-500 text-navy-900'
          : 'border-transparent text-navy-500 hover:text-navy-700'
      }`}
    >
      {children}
    </button>
  );
}
