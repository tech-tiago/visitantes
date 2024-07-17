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
    const messageContent = document.querySelector('#messageContent');
    messageContent.innerHTML = `<h2>${message.subject}</h2><p><strong>From:</strong> ${message.sender}</p><p>${message.body}</p>`;
    toggleModal('viewMessageModal');
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
        alert('Todos os campos são obrigatórios.');
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

    alert('Mensagem enviada com sucesso!');
}

function deleteMessage() {
    // Simulate deleting the message
    console.log('Deleting message');

    // Close the modal
    toggleModal('viewMessageModal');

    alert('Mensagem deletada com sucesso!');
}

function forwardMessage() {
    const forwardModal = document.getElementById('forwardMessageModal');
    const messageContent = document.getElementById('messageContent').innerHTML;
    document.getElementById('forwardMessageBody').value = messageContent;

    toggleModal('viewMessageModal');
    toggleModal('forwardMessageModal');
}

function sendForwardedMessage() {
    const to = document.getElementById('forwardMessageTo').value;
    const subject = document.getElementById('forwardMessageSubject').value;
    const body = document.getElementById('forwardMessageBody').value;

    if (!to || !subject || !body) {
        alert('Todos os campos são obrigatórios.');
        return;
    }

    // Simulate sending the forwarded message
    console.log('Forwarding message', { to, subject, body });

    // Close the modal
    toggleModal('forwardMessageModal');

    // Clear the form
    document.getElementById('forwardMessageTo').value = '';
    document.getElementById('forwardMessageSubject').value = '';
    document.getElementById('forwardMessageBody').value = '';

    alert('Mensagem encaminhada com sucesso!');
}

function replyMessage() {
    const replyModal = document.getElementById('replyMessageModal');
    const messageContent = document.getElementById('messageContent').innerHTML;
    const sender = messageContent.match(/<p><strong>From:<\/strong> (.*?)<\/p>/)[1];

    document.getElementById('replyMessageTo').value = sender;
    document.getElementById('replyMessageBody').value = '';

    toggleModal('viewMessageModal');
    toggleModal('replyMessageModal');
}

function sendReplyMessage() {
    const to = document.getElementById('replyMessageTo').value;
    const subject = document.getElementById('replyMessageSubject').value;
    const body = document.getElementById('replyMessageBody').value;

    if (!to || !subject || !body) {
        alert('Todos os campos são obrigatórios.');
        return;
    }

    // Simulate sending the reply message
    console.log('Replying to message', { to, subject, body });

    // Close the modal
    toggleModal('replyMessageModal');

    // Clear the form
    document.getElementById('replyMessageTo').value = '';
    document.getElementById('replyMessageSubject').value = '';
    document.getElementById('replyMessageBody').value = '';

    alert('Mensagem respondida com sucesso!');
}
