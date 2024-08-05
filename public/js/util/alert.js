function showAlert(message, type = 'is-info') {
    const notificationContainer = document.getElementById('notificationContainer');
    if (!notificationContainer) {
        console.error('Contêiner de notificação não encontrado.');
        return;
    }

    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <button class="delete"></button>
        ${message}
    `;

    notificationContainer.appendChild(notification);

    // Adicionar evento para remover a notificação ao clicar no botão de fechar
    notification.querySelector('.delete').addEventListener('click', () => {
        notification.remove();
    });

    // Mostrar notificação com animação
    setTimeout(() => {
        notification.classList.add('show');
    }, 10); // Timeout pequeno para garantir a transição

    // Remover a notificação após 5 segundos
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 500); // Timeout para permitir a transição de saída
    }, 5000);
}
