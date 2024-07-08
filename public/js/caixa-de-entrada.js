document.addEventListener('DOMContentLoaded', () => {
    loadInbox();
});

function loadInbox() {
    // Fetch and display messages from the server (dummy data for now)
    const messages = [
        { id: 1, sender: 'alice@example.com', subject: 'Hello!', body: 'How are you?', date: '2024-07-05' },
        { id: 2, sender: 'bob@example.com', subject: 'Meeting', body: 'Let\'s schedule a meeting.', date: '2024-07-04' },
    ];

    const messageList = document.querySelector('.message-list');
    messageList.innerHTML = '';
    messages.forEach(message => {
        const messageItem = document.createElement('div');
        messageItem.className = 'message-item';
        messageItem.innerHTML = `<strong>${message.sender}</strong><br><em>${message.subject}</em><br><small>${message.date}</small>`;
        messageItem.addEventListener('click', () => showMessage(message));
        messageList.appendChild(messageItem);
    });
}

function showMessage(message) {
    const messageContent = document.querySelector('.message-content');
    messageContent.innerHTML = `<h2>${message.subject}</h2><p><strong>From:</strong> ${message.sender}</p><p>${message.body}</p>`;
}

function composeMessage() {
    toggleModal('composeModal');
}

function toggleModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.classList.toggle('is-active');
}

function sendMessage() {
    const to = document.getElementById('messageTo').value;
    const subject = document.getElementById('messageSubject').value;
    const body = document.getElementById('messageBody').value;

    if (!to || !subject || !body) {
        alert('All fields are required.');
        return;
    }

    // Simulate sending the message to the server
    console.log('Sending message', { to, subject, body });

    // Close the modal
    toggleModal('composeModal');

    // Clear the form
    document.getElementById('messageTo').value = '';
    document.getElementById('messageSubject').value = '';
    document.getElementById('messageBody').value = '';

    alert('Message sent successfully!');
}
