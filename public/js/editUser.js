document.addEventListener('DOMContentLoaded', function() {
    const token = localStorage.getItem('token');

    if (!token) {
        window.location.href = '/login';
        return;
    }

    function fetchUserInfo() {
        fetch('/api/auth/user-info', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }).then(response => {
            if (!response.ok) {
                throw new Error('Erro ao carregar informações do usuário');
            }
            return response.json();
        }).then(data => {
            document.getElementById('username').value = data.username;
            document.getElementById('nome').value = data.nome;
            if (data.foto) {
                const photoUrl = `../images/${data.foto}`;
                document.getElementById('currentFoto').src = photoUrl;
                document.getElementById('userImage').src = photoUrl;
            }
            document.getElementById('loggedName').textContent = data.nome;
        }).catch(error => {
            console.error('Erro:', error);
            showAlert('Erro ao carregar informações do usuário', 'danger');
        });
    }

    fetchUserInfo();

    document.getElementById('editUserForm').addEventListener('submit', function(event) {
        event.preventDefault();

        const formData = new FormData();
        formData.append('username', document.getElementById('username').value.trim());
        formData.append('nome', document.getElementById('nome').value.trim());
        const password = document.getElementById('password').value.trim();
        if (password) {
            formData.append('password', password);
        }
        const fotoFile = document.getElementById('foto').files[0];
        if (fotoFile) {
            formData.append('foto', fotoFile);
        }

        fetch('/api/auth/update-user', {
            method: 'POST',
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
            fetchUserInfo();
        }).catch(error => {
            console.error('Erro:', error);
            showAlert('Erro ao atualizar usuário', 'danger');
        });
    });

    document.getElementById('foto').addEventListener('change', function(event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                document.getElementById('currentFoto').src = e.target.result;
                document.getElementById('userImage').src = e.target.result;
            };
            reader.readAsDataURL(file);
        }
    });
});
