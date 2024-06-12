document.addEventListener('DOMContentLoaded', function() {
    var currentDate = new Date().toISOString().split('T')[0];
    var currentTime = new Date().toTimeString().split(' ')[0];

    document.getElementById('dataEntrada').value = currentDate;
    document.getElementById('horaEntrada').value = currentTime;

    document.getElementById('capturePhoto').addEventListener('click', function() {
        var modal = new Foundation.Reveal($('#photoModal'));
        modal.open();
    });


    
    document.getElementById('snap').addEventListener('click', function() {
        var canvas = document.getElementById('canvas');
        var video = document.getElementById('video');
        var context = canvas.getContext('2d');
    
        if (video.srcObject && video.readyState === video.HAVE_ENOUGH_DATA) {
            context.drawImage(video, 0, 0, canvas.width, canvas.height);
        } else {
            console.error('Não foi possível capturar a foto: fonte de vídeo não disponível.');
        }
    });

    document.getElementById('savePhoto').addEventListener('click', function() {
        var canvas = document.getElementById('canvas');
        var dataURL = canvas.toDataURL('image/png');
        var photoPreview = document.getElementById('photoPreview');
        photoPreview.src = dataURL; 
        photoPreview.style.display = 'block'; 
        document.getElementById('fotoInput').value = dataURL; 
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
          }).catch(error => {
              console.error('Erro:', error);
          });
    });

    // Acessando a webcam
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia({ video: true })
            .then(function(stream) {
                var video = document.getElementById('video');
                video.srcObject = stream;
            })
            .catch(function(err) {
                console.log("Ocorreu um erro ao acessar a câmera: " + err);
            });
    } else {
        console.error('getUserMedia is not supported on your browser!');
    }
});
