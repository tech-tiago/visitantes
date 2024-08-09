$(document).ready(function() {
    const token = localStorage.getItem('token');
    const userLevel = localStorage.getItem('userLevel');
    
    if (userLevel !== 'admin') {
        location.href = document.referrer;
    }

    var table = $('#userTable').DataTable({
        paging: false,
        ordering: false,
        info: false,
        pageLength: 50,
        language: {
            url: "https://cdn.datatables.net/plug-ins/1.11.3/i18n/pt_br.json"
        },
        ajax: {
            url: '/api/auth/users',
            headers: {
                'Authorization': 'Bearer ' + token
            },
            dataSrc: ''
        },
        columns: [
            { data: 'nome' },
            { data: 'username' },
            { data: 'level' },
            {
                data: null,
                className: 'dt-center',
                defaultContent: '<button class="edit-btn button is-small is-warning"><i class="fas fa-edit"></i> Editar</button>'
            }
        ]
    });

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

    $('#userForm').submit(function(event) {
        event.preventDefault();
        const formData = new FormData(this);

        $.ajax({
            url: '/api/auth/register',
            method: 'POST',
            processData: false,
            contentType: false,
            headers: {
                'Authorization': 'Bearer ' + token
            },
            data: formData,
            success: function(response) {
                showAlert('Usuário registrado com sucesso!', 'success');
                table.ajax.reload();
                $('#userModal').removeClass('is-active');
            },
            error: function(error) {
                console.error('Erro ao registrar usuário:', error);
                showAlert('Erro ao registrar usuário. Verifique o console para mais detalhes.', 'danger');
            }
        });
    });

    $('#userTable').on('click', '.edit-btn', function() {
        var data = table.row($(this).parents('tr')).data();
        $('#nome').val(data.nome);
        $('#username').val(data.username);
        $('#level').val(data.level);
        $('#imagePreview').attr('src', '/images/' + data.foto).show();
        $('#userModal').addClass('is-active');

        $('#userForm').off('submit').on('submit', function(event) {
            event.preventDefault();
            const formData = new FormData(this);
            formData.append('id', data.id);

            fetch('/api/auth/update', {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            }).then(response => {
                if (!response.ok) {
                    throw new Error('Erro ao atualizar usuário');
                }
                return response.json();
            }).then(data => {
                showAlert('Usuário atualizado com sucesso!', 'success');
                table.ajax.reload();
                $('#userModal').removeClass('is-active');
            }).catch(error => {
                console.error('Erro:', error);
                showAlert('Erro ao atualizar usuário', 'danger');
            });
        });
    });

    $('#addUserBtn').click(function() {
        $('#userForm')[0].reset();
        $('#imagePreview').hide();
        $('#userModal').addClass('is-active');
    });

    $('[data-close]').click(function() {
        $('#userModal').removeClass('is-active');
    });
});

function showAlert(message, type) {
    const alertContainer = $('#alert-container');
    const alert = $('<div>').addClass(`notification is-${type}`).text(message);
    alertContainer.append(alert);
    setTimeout(() => {
        alert.remove();
    }, 3000);
}
