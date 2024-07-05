document.addEventListener('DOMContentLoaded', () => {
    const registerBiometricButton = document.getElementById('registerBiometric');
    const biometricModal = document.getElementById('biometricModal');
    const modalCloseButton = biometricModal.querySelector('.modal-close');
    const fingerButtons = biometricModal.querySelectorAll('.finger-btn');

    // Abrir modal
    registerBiometricButton.addEventListener('click', () => {
        biometricModal.classList.add('is-active');
    });

    // Fechar modal
    modalCloseButton.addEventListener('click', () => {
        biometricModal.classList.remove('is-active');
    });

    // Iniciar registro biométrico ao selecionar um dedo
    fingerButtons.forEach(button => {
        button.addEventListener('click', async () => {
            const finger = button.getAttribute('data-finger');
            try {
                const response = await fetch('/api/start-biometric-registration', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ finger })
                });

                const data = await response.json();
                if (data.success) {
                    alert('Registro de biometria iniciado com sucesso');
                } else {
                    alert('Erro: ' + data.message);
                }
            } catch (error) {
                console.error('Erro:', error);
                alert('Erro ao iniciar registro de biometria');
            } finally {
                biometricModal.classList.remove('is-active');
            }
        });
    });
});
