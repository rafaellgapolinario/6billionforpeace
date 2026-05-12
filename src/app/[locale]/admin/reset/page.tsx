import { ResetForm } from './ResetForm';

export default function ResetPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-navy-900 px-4 py-10 text-white">
      <div className="w-full max-w-md rounded-3xl border border-white/10 bg-navy-800/50 p-8 backdrop-blur">
        <p className="font-script text-3xl text-cyan-400">6billionforpeace</p>
        <h1 className="mt-3 text-xl font-semibold">Definir nova senha</h1>
        <p className="mt-2 text-sm text-white/70">
          Você clicou no link de recuperação enviado por email. Defina a nova senha abaixo.
        </p>
        <ResetForm />
      </div>
    </main>
  );
}
