import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useState } from 'react';
import { AppShell, Screen } from '@/components/arcade/shell';
import { Button } from '@/components/arcade/ui';
import { useAuthStore } from '@/stores/authStore';
import { api } from '@/lib/api';

export const Route = createFileRoute('/login')({
  component: LoginScreen,
});

function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isRegister, setIsRegister] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const setAuth = useAuthStore(state => state.setAuth);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const endpoint = isRegister ? '/auth/register' : '/auth/login';
      const payload = isRegister ? { email, password, displayName: name } : { email, password };
      
      const { data } = await api.post<{ data: { user: any, accessToken: string, refreshToken: string } }>(endpoint, payload);
      
      setAuth(data.user, data.accessToken, data.refreshToken);
      navigate({ to: '/' });
    } catch (err: any) {
      setError(err.error?.message || err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppShell>
      <Screen className="flex flex-col items-center justify-center min-h-[80vh]">
        <h1 className="font-display text-4xl mb-8">THE ARCADE</h1>
        
        <form onSubmit={handleSubmit} className="w-full max-w-sm bg-card p-6 rounded-3xl shadow-card space-y-4">
          <h2 className="text-xl font-bold mb-4">{isRegister ? 'Create Account' : 'Welcome Back'}</h2>
          
          {error && <div className="p-3 bg-destructive/20 text-destructive text-sm rounded-xl">{error}</div>}
          
          {isRegister && (
            <div>
              <label className="text-xs text-muted-foreground ml-1">Display Name</label>
              <input 
                type="text" 
                value={name} 
                onChange={e => setName(e.target.value)}
                className="w-full bg-background rounded-xl p-3 mt-1 outline-none focus:ring-2 ring-primary"
                required
              />
            </div>
          )}
          
          <div>
            <label className="text-xs text-muted-foreground ml-1">Email</label>
            <input 
              type="email" 
              value={email} 
              onChange={e => setEmail(e.target.value)}
              className="w-full bg-background rounded-xl p-3 mt-1 outline-none focus:ring-2 ring-primary"
              required
            />
          </div>
          
          <div>
            <label className="text-xs text-muted-foreground ml-1">Password</label>
            <input 
              type="password" 
              value={password} 
              onChange={e => setPassword(e.target.value)}
              className="w-full bg-background rounded-xl p-3 mt-1 outline-none focus:ring-2 ring-primary"
              required
            />
          </div>

          <Button type="submit" className="w-full mt-4" disabled={loading}>
            {loading ? 'Processing...' : (isRegister ? 'Join Arcade' : 'Login')}
          </Button>

          <button 
            type="button" 
            onClick={() => setIsRegister(!isRegister)}
            className="w-full text-sm text-primary mt-2 p-2"
          >
            {isRegister ? 'Already have an account? Login' : 'Need an account? Register'}
          </button>
        </form>
      </Screen>
    </AppShell>
  );
}
