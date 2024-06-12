document.addEventListener('DOMContentLoaded', function() {
    var currentDate = new Date().toISOString().split('T')[0];

    // Obter a hora no formato HH:mm
    var currentTime = new Date().toTimeString().split(' ')[0];
    currentTime = currentTime.substring(0, 5); // Remover os segundos

    document.getElementById('dataEntrada').value = currentDate;
    document.getElementById('horaEntrada').value = currentTime;

    document.getElementById('capturePhoto').addEventListener('click', function() {
        var photoModal = document.getElementById('photoModal');
        photoModal.classList.add('is-active');
    });

    var video = document.getElementById('video');
    var canvas = document.getElementById('canvas');
    var photoPreview = document.getElementById('photoPreview');
    var context = canvas.getContext('2d');

    document.getElementById('snap').addEventListener('click', function() {
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
    });

    document.getElementById('savePhoto').addEventListener('click', function() {
        var dataURL = canvas.toDataURL('image/png'); // Alterado para image/jpeg
        photoPreview.src = dataURL;
        photoPreview.style.display = 'block';
        document.getElementById('fotoInput').value = dataURL; // Armazenar a foto como base64 no input hidden

        var photoModal = document.getElementById('photoModal');
        photoModal.classList.remove('is-active');
    });

    document.getElementById('visitorForm').addEventListener('submit', function(event) {
        event.preventDefault();
        const nome = document.getElementById('nomeCompleto').value;
        const documento = document.getElementById('documento').value;
        const motivo = document.getElementById('motivoVisita').value;
        const data_entrada = document.getElementById('dataEntrada').value;
        const hora_entrada = document.getElementById('horaEntrada').value;
        const foto = document.getElementById('fotoInput').value; // Obtém a foto como base64 do input hidden
        
        // Recuperar o token do localStorage
        const token = localStorage.getItem('token');
        if (!token) {
            console.error('Token de autenticação não encontrado.');
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
              alert('Visitante registrado com sucesso!');
              window.location.reload(); // Recarregar a página após o cadastro
          }).catch(error => {
              console.error('Erro:', error);
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
            });
    } else {
        console.error('getUserMedia is not supported on your browser!');
    }

    // Fechar modal ao clicar no fundo ou no botão de fechar
    document.querySelectorAll('.modal-background, .modal-close, #closeModal').forEach(function(element) {
        element.addEventListener('click', function() {
            var photoModal = document.getElementById('photoModal');
            photoModal.classList.remove('is-active');
        });
    });
});
