import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import type { User } from '@supabase/supabase-js';

interface AuthContextType {
  user: User | null;
  userRole: 'admin' | 'user' | null;
  signIn: (email: string, password: string) => Promise<{ error?: string }>;
  signUp: (email: string, password: string, userData?: { role?: string }) => Promise<{ error?: string }>;
  signOut: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userRole, setUserRole] = useState<'admin' | 'user' | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Récupérer la session actuelle
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        determineUserRole(session.user);
      }
      setLoading(false);
    });

    // Écouter les changements d'auth
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        determineUserRole(session.user);
      } else {
        setUserRole(null);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const determineUserRole = async (user: User) => {
    // Vérifier si c'est l'admin avec l'email spécifique
    if (user.email === 'admin@groupeobv.com') {
      setUserRole('admin');
    } else {
      setUserRole('user');
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      // Connexion admin spéciale
      if (email === 'obv2024G' && password === 'Synergie2024') {
        const { error } = await supabase.auth.signInWithPassword({
          email: 'admin@groupeobv.com',
          password: 'Synergie2024Admin'
        });
        
        if (error) {
          // Si l'admin n'existe pas encore, le créer
          const { error: signUpError } = await supabase.auth.signUp({
            email: 'admin@groupeobv.com',
            password: 'Synergie2024Admin',
            options: {
              emailRedirectTo: `${window.location.origin}/`,
              data: {
                role: 'admin',
                username: 'obv2024G'
              }
            }
          });
          
          if (signUpError) {
            return { error: signUpError.message };
          }
          
          // Réessayer la connexion
          const { error: retryError } = await supabase.auth.signInWithPassword({
            email: 'admin@groupeobv.com',
            password: 'Synergie2024Admin'
          });
          
          if (retryError) {
            return { error: retryError.message };
          }
        }
      } else {
        // Connexion normale pour les autres utilisateurs
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password
        });
        
        if (error) {
          return { error: error.message };
        }
      }
      
      return {};
    } catch (error) {
      return { error: 'Erreur de connexion' };
    }
  };

  const signUp = async (email: string, password: string, userData?: { role?: string }) => {
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
          data: {
            role: userData?.role || 'user'
          }
        }
      });
      
      if (error) {
        return { error: error.message };
      }
      
      return {};
    } catch (error) {
      return { error: 'Erreur d\'inscription' };
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const value = {
    user,
    userRole,
    signIn,
    signUp,
    signOut,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}