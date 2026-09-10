import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { supabase, type Profile } from './supabase';

type AuthState = {
  profile: Profile | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, fullName: string, role: 'admin' | 'funcionario') => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthState | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    supabase.auth.getSession().then(({ data }) => {
      if (!mounted) return;
      if (data.session) {
        loadProfile(data.session.user.id);
      } else {
        setLoading(false);
      }
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      (async () => {
        if (session?.user) {
          await loadProfile(session.user.id);
        } else {
          setProfile(null);
          setLoading(false);
        }
      })();
    });

    async function loadProfile(userId: string) {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, email, full_name, role, avatar_url, created_at')
        .eq('id', userId)
        .maybeSingle();

      if (error) {
        console.error('Erro ao carregar perfil:', error.message);
      }
      if (mounted) {
        setProfile(data as Profile | null);
        setLoading(false);
      }
    }

    return () => {
      mounted = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  async function signIn(email: string, password: string) {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw new Error(translateError(error.message));
  }

  async function signUp(email: string, password: string, fullName: string, role: 'admin' | 'funcionario') {
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) throw new Error(translateError(error.message));
    if (!data.user) throw new Error('Não foi possível criar a conta.');

    const { error: profileError } = await supabase.from('profiles').insert({
      id: data.user.id,
      email,
      full_name: fullName,
      role,
    });
    if (profileError) throw new Error('Conta criada, mas falha ao salvar perfil: ' + translateError(profileError.message));
  }

  async function signOut() {
    await supabase.auth.signOut();
    setProfile(null);
  }

  return (
    <AuthContext.Provider value={{ profile, loading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

function translateError(message: string): string {
  const map: Record<string, string> = {
    'Invalid login credentials': 'E-mail ou senha incorretos.',
    'User already registered': 'Este e-mail já está cadastrado.',
    'Password should be at least 6 characters': 'A senha deve ter no mínimo 6 caracteres.',
    'Unable to validate email address': 'E-mail inválido.',
  };
  return map[message] ?? message;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth deve ser usado dentro de AuthProvider');
  return ctx;
}
