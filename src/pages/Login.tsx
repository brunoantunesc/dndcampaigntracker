import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CommonButton } from '../components/ui/Buttons';
import { useAuth } from '../contexts/AuthContext';
import { useRoutes } from '../contexts/RoutesContext';
import { fetchRoutes } from '../services/api';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();
  const { setRoutes } = useRoutes();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch('/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || 'Erro ao fazer login');
        return;
      }

      login(data.token, data.name);

      const dataRoutes = await fetchRoutes();
      setRoutes(dataRoutes);
      localStorage.setItem('routes', JSON.stringify(dataRoutes));

      navigate('/');
    } catch (err) {
      setError('Erro ao conectar com o servidor');
    }
  };

  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h1>Login</h1>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="E-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{ margin: '10px', padding: '10px', fontSize: '1rem' }}
        />

        <br />

        <input
          type="password"
          placeholder="Senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{ margin: '10px', padding: '10px', fontSize: '1rem' }}
        />

        <br />

        <CommonButton type="submit" className="mt-4">
          Entrar
        </CommonButton>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}
