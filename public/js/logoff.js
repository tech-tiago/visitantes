document.addEventListener('DOMContentLoaded', function() {
    // Verificação de autenticação
    const token = localStorage.getItem('token');
    const currentPath = window.location.pathname;

    if (!token && currentPath !== '/login.html') {
        // Redirecionar diretamente para a página de login se não estiver autenticado
        window.location.href = '/login.html';
    }

    // Adicionar a classe 'authenticated' ao body se estiver autenticado
    if (token) {
        document.body.classList.add('authenticated');
    }

  // Lógica de logoff
  const logoutButton = document.getElementById('logoutButton');
  if (logoutButton) {
      logoutButton.addEventListener('click', function(event) {
          event.preventDefault();
          localStorage.removeItem('token');
          alert('Você saiu com sucesso!');
          window.location.href = '/login.html'; // Redirecionar para a página de login
      });
  }
});
