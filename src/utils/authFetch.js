// src/utils/authFetch.js

export function resetLocalStorage() {
  // Remove o token e qualquer dado do usuário
  localStorage.removeItem('token');
  localStorage.removeItem('userName');
  localStorage.removeItem('routes');

}

export async function authFetch(url, options = {}) {
  const token = localStorage.getItem('token');
  
  const headers = {
    ...options.headers,
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  };

  if (options.body) {
    headers['Content-Type'] = 'application/json';
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });
  
    if (response.status === 401 || response.status === 403) {
    resetLocalStorage()

    // Redireciona para a página de login
    window.location.href = '/login';

    // Para o fluxo (opcional)
    return Promise.reject(new Error('Sessão expirada, faça login novamente.'));
  }

  return response;
}