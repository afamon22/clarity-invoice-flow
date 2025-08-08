import { createContext, useContext, useEffect, useState } from 'react';

interface AuthContextType {
  user: { email: string; id: string } | null;
  userRole: 'admin' | 'user' | null;
  signIn: (email: string, password: string) => Promise<{ error?: string }>;
  signOut: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<{ email: string; id: string } | null>(null);
  const [userRole, setUserRole] = useState<'admin' | 'user' | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Vérifier s'il y a une session sauvegardée
    const savedUser = localStorage.getItem('user');
    const savedRole = localStorage.getItem('userRole');
    
    if (savedUser && savedRole) {
      setUser(JSON.parse(savedUser));
      setUserRole(savedRole as 'admin' | 'user');
    }
    
    setLoading(false);
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      // Authentification admin locale
      if (email === 'obv2024G' && password === 'Synergie2024') {
        const adminUser = {
          email: 'admin@groupeobv.com',
          id: 'admin-001'
        };
        
        setUser(adminUser);
        setUserRole('admin');
        
        // Sauvegarder la session
        localStorage.setItem('user', JSON.stringify(adminUser));
        localStorage.setItem('userRole', 'admin');
        
        return {};
      }
      
      // Pour d'autres utilisateurs (à configurer plus tard)
      if (email && password) {
        const regularUser = {
          email: email,
          id: 'user-' + Date.now()
        };
        
        setUser(regularUser);
        setUserRole('user');
        
        localStorage.setItem('user', JSON.stringify(regularUser));
        localStorage.setItem('userRole', 'user');
        
        return {};
      }
      
      return { error: 'Identifiants invalides' };
    } catch (error) {
      return { error: 'Erreur de connexion' };
    }
  };

  const signOut = async () => {
    setUser(null);
    setUserRole(null);
    localStorage.removeItem('user');
    localStorage.removeItem('userRole');
  };

  const value = {
    user,
    userRole,
    signIn,
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