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
            console.log('Nome do usuário:', data.nome);
            console.log('Foto do usuário:', data.foto);

            // Salvar o token no localStorage e o nível do usuário
            localStorage.setItem('token', data.token);
            localStorage.setItem('username', username); // Salvar o nome de usuário
            localStorage.setItem('userLevel', data.level);
            localStorage.setItem('nome', data.nome); // Salvar o nome
            localStorage.setItem('foto', data.foto); // Salvar a foto

            window.location.href = '/'; // Redirecionar para a página principal
        }).catch(error => {
            console.error('Erro:', error);
            showAlert('Credenciais inválidas. Por favor, tente novamente.', 'is-danger');
        });
    });
});
