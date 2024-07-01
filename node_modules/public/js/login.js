document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('loginForm').addEventListener('submit', function(event) {
        event.preventDefault();
        
        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value.trim();

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
            console.log('Nível do usuário:', data.level);

            // Salvar o token no localStorage e o nível do usuário
            localStorage.setItem('token', data.token);
            localStorage.setItem('username', username); // Salvar o nome do usuário
            localStorage.setItem('userLevel', data.level);

            alert('Login realizado com sucesso!');
            // Redirecionar para outra página ou fazer outra ação necessária
            window.location.href = '/'; // Redirecionar para a página principal
        }).catch(error => {
            console.error('Erro:', error);
            alert('Credenciais inválidas. Por favor, tente novamente.');
        });
    });
});
