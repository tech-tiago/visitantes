$(document).ready(function() {
    $('#foto').change(function(event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                $('#imagePreview').attr('src', e.target.result).show();
            }
            reader.readAsDataURL(file);
        }
    });

    $('#registerForm').submit(function(event) {
        event.preventDefault();
        const formData = new FormData(this);

        $.ajax({
            url: '/api/auth/register',
            method: 'POST',
            processData: false,
            contentType: false,
            data: formData,
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
