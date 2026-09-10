import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { apiError } from "@/lib/api";
import { Lock, ArrowLeft, LogIn } from "lucide-react";

export default function AdminLogin() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  if (user) return <Navigate to="/admin/painel" replace />;

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      await login(email, password);
      navigate("/admin/painel");
    } catch (err) {
      setError(apiError(err, "Não foi possível entrar."));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 relative overflow-hidden grid place-items-center px-4" data-testid="admin-login-page">
      <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-brand-cyan/15 blur-3xl" />
      <div className="absolute -bottom-24 -right-24 w-96 h-96 rounded-full bg-brand-purple/10 blur-3xl" />

      <div className="relative w-full max-w-md">
        <Link to="/" className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-400 hover:text-brand-blue mb-6 transition-colors" data-testid="back-to-site-link">
          <ArrowLeft size={15} /> Voltar ao site
        </Link>

        <div className="bg-white rounded-3xl border border-slate-100 shadow-xl shadow-brand-blue/5 p-8 sm:p-10">
          <div className="w-12 h-12 rounded-2xl bg-brand-blue/10 text-brand-blue grid place-items-center mb-6">
            <Lock size={22} />
          </div>
          <h1 className="font-display text-2xl font-extrabold text-slate-900">Painel do Instituto</h1>
          <p className="text-sm text-slate-500 mt-1.5">Acesso restrito à equipe administrativa.</p>

          <form onSubmit={submit} className="mt-7 space-y-4" data-testid="admin-login-form">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400" htmlFor="admin-email">E-mail</label>
              <input
                id="admin-email"
                data-testid="admin-email-input"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-cyan/50 focus:border-brand-cyan"
                placeholder="seu@email.com"
              />
            </div>
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400" htmlFor="admin-password">Senha</label>
              <input
                id="admin-password"
                data-testid="admin-password-input"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-cyan/50 focus:border-brand-cyan"
                placeholder="••••••••"
              />
            </div>

            {error && (
              <p className="text-sm font-semibold text-red-500" data-testid="admin-login-error">{error}</p>
            )}

            <button
              type="submit"
              disabled={busy}
              data-testid="admin-login-submit"
              className="w-full inline-flex items-center justify-center gap-2 bg-brand-blue hover:bg-brand-cyan disabled:opacity-60 text-white font-bold px-6 py-3.5 rounded-full transition-colors"
            >
              <LogIn size={17} />
              {busy ? "Entrando…" : "Entrar"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
