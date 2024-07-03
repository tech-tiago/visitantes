// Função para exibir o alerta
function showAlert(message, type) {
    const alertContainer = document.getElementById('alert-container');
    const notification = document.createElement('div');
    notification.className = `notification is-${type}`;
    notification.innerHTML = `
        <button class="delete"></button>
        <i class="fas fa-exclamation-circle"></i> ${message}
    `;
    alertContainer.appendChild(notification);
    
    // Add event listener to remove alert
    notification.querySelector('.delete').addEventListener('click', () => {
        alertContainer.removeChild(notification);
    });

    // Automatically remove the alert after 5 seconds
    setTimeout(() => {
        if (alertContainer.contains(notification)) {
            alertContainer.removeChild(notification);
        }
    }, 5000);
}