document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('loginForm').addEventListener('submit', function(event) {
        event.preventDefault();
        
        const username = document.getElementById('username').value.trim(); // Remove espaços em branco
        const password = document.getElementById('password').value.trim(); // Remove espaços em branco

        fetch('/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        }).then(response => {
            if (!response.ok) {
                throw new Error('Erro ao fazer login');
            }
            return response.json();
        }).then(data => {
            console.log('Token de acesso:', data.token);
            // Salvar o token no localStorage ou sessionStorage
            localStorage.setItem('token', data.token); // Exemplo: salvando no localStorage
            alert('Login realizado com sucesso!');
            // Redirecionar para outra página ou fazer outra ação necessária
            window.location.href = '/'; // Exemplo: redirecionando para a página de registro
        }).catch(error => {
            console.error('Erro:', error);
            alert('Credenciais inválidas. Por favor, tente novamente.');
        });
    });
});
