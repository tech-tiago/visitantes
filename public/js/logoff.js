document.addEventListener('DOMContentLoaded', function() {
    // Função para verificar se o token é válido
    function isTokenValid() {
        const token = localStorage.getItem('token');
        if (!token) {
            return false; // Token não existe
        }

        // Decodifica o token JWT para verificar sua validade
        try {
            const tokenData = JSON.parse(atob(token.split('.')[1]));
            const expirationTime = tokenData.exp * 1000; // Converte para milissegundos
            const currentTimestamp = new Date().getTime();

            return currentTimestamp < expirationTime;
        } catch (error) {
            return false; // Token inválido
        }
    }

    // Função para deslogar o usuário
    function logout() {
        localStorage.removeItem('token');
        window.location.href = '/login.html'; // Redireciona para a página de login
    }

    // Verifica o token a cada 5 minutos
    setInterval(() => {
        if (!isTokenValid()) {
            logout();
        }
    }, 5 * 60 * 1000); // 5 minutos em milissegundos

    // Executa a verificação uma vez quando a página é carregada
    if (!isTokenValid()) {
        logout();
    }

    // Lógica de logoff
    const logoutButton = document.getElementById('logoutButton');
    if (logoutButton) {
        logoutButton.addEventListener('click', function(event) {
            event.preventDefault();
            logout();
        });
    }
});
