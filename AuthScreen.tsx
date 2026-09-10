import { useState } from 'react';
import { useAuth } from '@/lib/auth';
import { Eye, EyeOff, Lock, Mail, User, Shield, Hammer, Pickaxe, Blocks, Sparkles, ArrowRight, AlertCircle, Loader2 } from 'lucide-react';

type Mode = 'login' | 'signup';
type Role = 'admin' | 'funcionario';

export default function AuthScreen() {
  const { signIn, signUp } = useAuth();
  const [mode, setMode] = useState<Mode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState<Role>('funcionario');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError('');
    setBusy(true);
    try {
      if (mode === 'login') {
        await signIn(email.trim(), password);
      } else {
        if (fullName.trim().length < 2) throw new Error('Digite seu nome completo.');
        await signUp(email.trim(), password, fullName.trim(), role);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ocorreu um erro.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-bg" />
      <div className="auth-particles">
        {Array.from({ length: 18 }).map((_, i) => (
          <span key={i} style={{ '--d': `${i * 0.4}s`, '--x': `${(i * 37) % 100}%`, '--s': `${0.6 + (i % 3) * 0.3}px` } as React.CSSProperties} />
        ))}
      </div>

      <div className="auth-card">
        <div className="auth-brand">
          <div className="auth-logo"><Blocks size={30} strokeWidth={2} /></div>
          <div className="auth-brand-text">
            <strong>CraftBoard</strong>
            <span>Sistema de Gestão</span>
          </div>
        </div>

        <div className="auth-tabs">
          <button className={mode === 'login' ? 'active' : ''} onClick={() => { setMode('login'); setError(''); }}>Entrar</button>
          <button className={mode === 'signup' ? 'active' : ''} onClick={() => { setMode('signup'); setError(''); }}>Cadastrar</button>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {mode === 'signup' && (
            <div className="mc-field">
              <label><User size={13} /> Nome completo</label>
              <div className="mc-input-wrap">
                <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Steve Minecraft" required disabled={busy} />
              </div>
            </div>
          )}

          <div className="mc-field">
            <label><Mail size={13} /> E-mail</label>
            <div className="mc-input-wrap">
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="steve@craftboard.com" required disabled={busy} />
            </div>
          </div>

          <div className="mc-field">
            <label><Lock size={13} /> Senha</label>
            <div className="mc-input-wrap mc-input-password">
              <input type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required minLength={6} disabled={busy} />
              <button type="button" onClick={() => setShowPassword(!showPassword)} tabIndex={-1}>
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {mode === 'signup' && (
            <div className="mc-field">
              <label><Shield size={13} /> Tipo de conta</label>
              <div className="role-picker">
                <button type="button" className={role === 'admin' ? 'active' : ''} onClick={() => setRole('admin')} disabled={busy}>
                  <Shield size={20} />
                  <div><strong>Administrador</strong><span>Acesso total ao sistema</span></div>
                </button>
                <button type="button" className={role === 'funcionario' ? 'active' : ''} onClick={() => setRole('funcionario')} disabled={busy}>
                  <Hammer size={20} />
                  <div><strong>Funcionário</strong><span>Acesso operacional</span></div>
                </button>
              </div>
            </div>
          )}

          {error && (
            <div className="auth-error"><AlertCircle size={15} /> {error}</div>
          )}

          <button type="submit" className="mc-button auth-submit" disabled={busy}>
            {busy ? <Loader2 size={17} className="spin" /> : <Sparkles size={17} />}
            <span>{mode === 'login' ? 'Entrar no mundo' : 'Criar conta'}</span>
            {!busy && <ArrowRight size={16} />}
          </button>
        </form>

        <div className="auth-footer">
          {mode === 'login' ? (
            <>Novo por aqui? <button onClick={() => { setMode('signup'); setError(''); }}>Crie sua conta</button></>
          ) : (
            <>Já tem conta? <button onClick={() => { setMode('login'); setError(''); }}>Faça login</button></>
          )}
        </div>
      </div>

      <div className="auth-hint">
        <Pickaxe size={13} />
        <span>Protótipo demonstrativo — cadastre-se com qualquer e-mail e senha (6+ caracteres)</span>
      </div>
    </div>
  );
}
