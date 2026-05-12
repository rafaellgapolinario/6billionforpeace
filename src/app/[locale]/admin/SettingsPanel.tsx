'use client';

import { useEffect, useState } from 'react';
import { toast } from 'sonner';

type Session = { userId: string; email: string; role: 'admin' | 'owner' };
type AdminUser = { user_id: string; email: string; role: 'admin' | 'owner'; created_at: string };

export function SettingsPanel({ session }: { session: Session }) {
  return (
    <div className="space-y-10">
      <AccountSection session={session} />
      {session.role === 'owner' && <AdminsSection session={session} />}
    </div>
  );
}

function AccountSection({ session }: { session: Session }) {
  const [pw, setPw] = useState('');
  const [pw2, setPw2] = useState('');
  const [saving, setSaving] = useState(false);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    if (pw.length < 8) {
      toast.error('Senha deve ter pelo menos 8 caracteres.');
      return;
    }
    if (pw !== pw2) {
      toast.error('Senhas não batem.');
      return;
    }
    setSaving(true);
    const res = await fetch('/api/admin/me/password', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ password: pw }),
    });
    setSaving(false);
    if (!res.ok) {
      toast.error('Não foi possível trocar a senha.');
      return;
    }
    toast.success('Senha atualizada.');
    setPw('');
    setPw2('');
  }

  return (
    <section className="rounded-2xl border border-navy-100 bg-white p-6">
      <h2 className="text-lg font-semibold text-navy-900">Minha conta</h2>
      <dl className="mt-4 grid gap-4 sm:grid-cols-2">
        <div>
          <dt className="text-xs uppercase tracking-wide text-navy-500">Email</dt>
          <dd className="mt-1 text-sm text-navy-900">{session.email}</dd>
        </div>
        <div>
          <dt className="text-xs uppercase tracking-wide text-navy-500">Função</dt>
          <dd className="mt-1 text-sm font-medium text-navy-900 capitalize">{session.role}</dd>
        </div>
      </dl>

      <form onSubmit={save} className="mt-8 max-w-md space-y-3">
        <h3 className="text-sm font-semibold text-navy-900">Trocar senha</h3>
        <p className="text-xs text-navy-600">
          A senha atual não é recuperável (criptografia one-way). Pra esquecer ou perder o acesso,
          use o fluxo &ldquo;Esqueci a senha&rdquo; na tela de login.
        </p>
        <input
          type="password"
          placeholder="Nova senha"
          autoComplete="new-password"
          value={pw}
          onChange={(e) => setPw(e.target.value)}
          minLength={8}
          required
          className="block w-full rounded-lg border border-navy-200 px-3 py-2 text-sm focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
        />
        <input
          type="password"
          placeholder="Repita a nova senha"
          autoComplete="new-password"
          value={pw2}
          onChange={(e) => setPw2(e.target.value)}
          required
          className="block w-full rounded-lg border border-navy-200 px-3 py-2 text-sm focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
        />
        <button
          type="submit"
          disabled={saving || !pw || !pw2}
          className="rounded-full bg-navy-900 px-5 py-2 text-sm font-medium text-white hover:bg-navy-800 disabled:opacity-60"
        >
          {saving ? 'Salvando…' : 'Atualizar senha'}
        </button>
      </form>
    </section>
  );
}

function AdminsSection({ session }: { session: Session }) {
  const [rows, setRows] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [pw, setPw] = useState('');
  const [role, setRole] = useState<'admin' | 'owner'>('admin');
  const [creating, setCreating] = useState(false);

  async function load() {
    setLoading(true);
    const res = await fetch('/api/admin/users');
    if (res.ok) {
      const json = await res.json();
      setRows(json.rows ?? []);
    }
    setLoading(false);
  }
  useEffect(() => {
    load();
  }, []);

  async function create(e: React.FormEvent) {
    e.preventDefault();
    if (pw.length < 8) {
      toast.error('Senha temporária deve ter pelo menos 8 caracteres.');
      return;
    }
    setCreating(true);
    const res = await fetch('/api/admin/users', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ email, password: pw, role }),
    });
    const json = await res.json();
    setCreating(false);
    if (!res.ok) {
      toast.error(json?.error ?? 'Erro ao criar.');
      return;
    }
    toast.success(`Admin criado: ${email}`);
    setEmail('');
    setPw('');
    setRole('admin');
    load();
  }

  async function remove(id: string, email: string) {
    if (!confirm(`Remover acesso admin de ${email}? Esta ação é irreversível.`)) return;
    const res = await fetch(`/api/admin/users/${id}`, { method: 'DELETE' });
    if (!res.ok) {
      const json = await res.json().catch(() => ({}));
      toast.error(json?.error ?? 'Erro ao remover.');
      return;
    }
    toast.success(`Removido: ${email}`);
    load();
  }

  async function changeRole(id: string, newRole: 'admin' | 'owner') {
    const res = await fetch(`/api/admin/users/${id}`, {
      method: 'PATCH',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ role: newRole }),
    });
    if (!res.ok) {
      const json = await res.json().catch(() => ({}));
      toast.error(json?.error ?? 'Erro ao atualizar.');
      return;
    }
    toast.success('Função atualizada.');
    load();
  }

  return (
    <section className="rounded-2xl border border-navy-100 bg-white p-6">
      <h2 className="text-lg font-semibold text-navy-900">Administradores</h2>
      <p className="mt-1 text-xs text-navy-600">
        Apenas <strong>owners</strong> podem gerenciar a equipe. Admins comuns só veem assinaturas
        e trocam a própria senha.
      </p>

      <div className="mt-6 overflow-hidden rounded-xl border border-navy-100">
        <table className="w-full text-sm">
          <thead className="bg-navy-50 text-left text-xs uppercase tracking-wide text-navy-600">
            <tr>
              <th className="px-4 py-2">Email</th>
              <th className="px-4 py-2">Função</th>
              <th className="px-4 py-2">Criado em</th>
              <th className="px-4 py-2 text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-navy-100">
            {loading ? (
              <tr>
                <td colSpan={4} className="px-4 py-4 text-center text-navy-500">
                  Carregando…
                </td>
              </tr>
            ) : rows.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-4 py-4 text-center text-navy-500">
                  Nenhum admin.
                </td>
              </tr>
            ) : (
              rows.map((r) => (
                <tr key={r.user_id}>
                  <td className="px-4 py-3">{r.email}</td>
                  <td className="px-4 py-3">
                    <select
                      value={r.role}
                      disabled={r.user_id === session.userId && r.role === 'owner'}
                      onChange={(e) => changeRole(r.user_id, e.target.value as 'admin' | 'owner')}
                      className="rounded border border-navy-200 px-2 py-1 text-xs"
                    >
                      <option value="admin">admin</option>
                      <option value="owner">owner</option>
                    </select>
                  </td>
                  <td className="px-4 py-3 text-xs text-navy-500">
                    {new Date(r.created_at).toLocaleDateString('pt-BR')}
                  </td>
                  <td className="px-4 py-3 text-right">
                    {r.user_id === session.userId ? (
                      <span className="text-xs text-navy-400">você</span>
                    ) : (
                      <button
                        onClick={() => remove(r.user_id, r.email)}
                        className="rounded-full border border-red-200 px-3 py-1 text-xs text-red-700 hover:bg-red-50"
                      >
                        Remover
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <form onSubmit={create} className="mt-6 grid gap-3 sm:grid-cols-[1fr_1fr_auto_auto]">
        <input
          type="email"
          placeholder="email@exemplo.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="rounded-lg border border-navy-200 px-3 py-2 text-sm focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
        />
        <input
          type="text"
          placeholder="Senha temporária (mín 8)"
          value={pw}
          onChange={(e) => setPw(e.target.value)}
          minLength={8}
          required
          className="rounded-lg border border-navy-200 px-3 py-2 text-sm focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
        />
        <select
          value={role}
          onChange={(e) => setRole(e.target.value as 'admin' | 'owner')}
          className="rounded-lg border border-navy-200 px-3 py-2 text-sm"
        >
          <option value="admin">admin</option>
          <option value="owner">owner</option>
        </select>
        <button
          type="submit"
          disabled={creating || !email || !pw}
          className="rounded-full bg-cyan-500 px-5 py-2 text-sm font-semibold text-navy-900 hover:bg-cyan-400 disabled:opacity-60"
        >
          {creating ? 'Criando…' : 'Adicionar'}
        </button>
      </form>
      <p className="mt-2 text-xs text-navy-500">
        O novo admin recebe a senha temporária pelo seu canal preferido. Ele pode trocar a senha
        no primeiro login pelo painel Configurações.
      </p>
    </section>
  );
}
