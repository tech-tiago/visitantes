$(document).ready(function() {
    $('#registerForm').submit(function(event) {
        event.preventDefault();
        var username = $('#username').val();
        var password = $('#password').val();
        var level = $('#level').val();
        
        $.ajax({
            url: '/api/auth/register',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({ username: username, password: password, level: level }),
            success: function(response) {
                alert('Usuário registrado com sucesso!');
            },
            error: function(error) {
                console.error('Erro ao registrar usuário:', error);
                alert('Erro ao registrar usuário. Verifique o console para mais detalhes.');
            }
        });
    });
});
