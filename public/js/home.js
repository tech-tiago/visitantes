document.addEventListener('DOMContentLoaded', function() {
    var currentDate = new Date().toISOString().split('T')[0];

    // Obter a hora no formato HH:mm
    var currentTime = new Date().toTimeString().split(' ')[0];
    currentTime = currentTime.substring(0, 5); // Remover os segundos

    document.getElementById('dataEntrada').value = currentDate;
    document.getElementById('horaEntrada').value = currentTime;

    var photoModal = document.getElementById('photoModal');
    var video = document.getElementById('video');
    var canvas = document.getElementById('canvas');
    var context = canvas.getContext('2d');
    var photoPreview = document.getElementById('photoPreview');
    var modalPhoto = document.getElementById('modalPhoto');
    var photoInput = document.getElementById('fotoInput');

    document.getElementById('capturePhoto').addEventListener('click', function() {
        photoModal.classList.add('is-active');
    });

    document.getElementById('snap').addEventListener('click', function() {
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        var dataURL = canvas.toDataURL('image/png'); // Captura a imagem
        modalPhoto.src = dataURL;
        modalPhoto.style.display = 'block';
    });

    document.getElementById('savePhoto').addEventListener('click', function() {
        var dataURL = canvas.toDataURL('image/png');
        photoPreview.src = dataURL;
        photoPreview.style.display = 'block';
        photoInput.value = dataURL; // Armazenar a foto como base64 no input hidden
        photoModal.classList.remove('is-active');
    });

    document.getElementById('closeModal').addEventListener('click', function() {
        photoModal.classList.remove('is-active');
    });

    document.getElementById('visitorForm').addEventListener('submit', function(event) {
        event.preventDefault();
        const nome = document.getElementById('nomeCompleto').value;
        const documento = document.getElementById('documento').value;
        const motivo = document.getElementById('motivoVisita').value;
        const data_entrada = document.getElementById('dataEntrada').value;
        const hora_entrada = document.getElementById('horaEntrada').value;
        const foto = photoInput.value; // Obtém a foto como base64 do input hidden

        // Recuperar o token do localStorage
        const token = localStorage.getItem('token');
        if (!token) {
            showAlert('Token de autenticação não encontrado.', 'is-danger');
            return;
        }

        fetch('/api/visitors', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ nome, documento, data_entrada, hora_entrada, foto, motivo })
        }).then(response => response.json())
          .then(data => {
              showAlert('Visitante registrado com sucesso!', 'is-success');
              window.location.reload(); // Recarregar a página após o cadastro
          }).catch(error => {
              console.error('Erro:', error);
              showAlert('Ocorreu um erro ao registrar o visitante.', 'is-danger');
          });
    });

    // Acessando a webcam
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia({ video: true })
            .then(function(stream) {
                video.srcObject = stream;
            })
            .catch(function(err) {
                console.log("Ocorreu um erro ao acessar a câmera: " + err);
                showAlert('Ocorreu um erro ao acessar a câmera.', 'is-danger');
            });
    } else {
        console.error('getUserMedia is not supported on your browser!');
        showAlert('Seu navegador não suporta acesso à câmera.', 'is-danger');
    }

    // Fechar modal ao clicar no fundo ou no botão de fechar
    document.querySelectorAll('.modal-background, .modal-close, #closeModal').forEach(function(element) {
        element.addEventListener('click', function() {
            photoModal.classList.remove('is-active');
        });
    });

    // Toggle do menu em dispositivos móveis
    document.querySelector('.navbar-burger').addEventListener('click', function() {
        document.querySelector('.navbar-burger').classList.toggle('is-active');
        document.querySelector('.navbar-menu').classList.toggle('is-active');
    });

});
