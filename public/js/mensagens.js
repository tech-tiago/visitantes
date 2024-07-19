document.addEventListener('DOMContentLoaded', () => {
    // Exemplo de mensagens
    const messages = [
        { id: 1, subject: 'Olá', sender: 'alice@example.com', date: '2023-05-20 10:00', body: 'Olá, tudo bem?', archived: false, deleted: false, read: false },
        { id: 2, subject: 'Reunião', sender: 'bob@example.com', date: '2023-05-21 12:30', body: 'Vamos marcar uma reunião.', archived: false, deleted: false, read: false },
        { id: 3, subject: 'Projeto', sender: 'carol@example.com', date: '2023-05-22 15:45', body: 'O projeto está quase pronto.', archived: false, deleted: false, read: false },
        { id: 4, subject: 'Atualização', sender: 'dave@example.com', date: '2023-05-23 09:15', body: 'Atualização importante sobre o projeto.', archived: false, deleted: false, read: false },
        { id: 5, subject: 'Feedback', sender: 'eve@example.com', date: '2023-05-24 11:00', body: 'Seu feedback foi recebido.', archived: false, deleted: false, read: false },
        { id: 6, subject: 'Convite', sender: 'frank@example.com', date: '2023-05-25 14:20', body: 'Você está convidado para um evento.', archived: false, deleted: false, read: false },
        { id: 7, subject: 'Lembrete', sender: 'grace@example.com', date: '2023-05-26 16:45', body: 'Lembre-se da reunião de amanhã.', archived: false, deleted: false, read: false },
        { id: 8, subject: 'Oferta', sender: 'heidi@example.com', date: '2023-05-27 18:30', body: 'Aproveite nossa oferta especial.', archived: false, deleted: false, read: false },
        { id: 9, subject: 'Resumo', sender: 'ivan@example.com', date: '2023-05-28 10:05', body: 'Resumo da reunião passada.', archived: false, deleted: false, read: false },
        { id: 10, subject: 'Confirmação', sender: 'judy@example.com', date: '2023-05-29 13:40', body: 'Sua inscrição foi confirmada.', archived: false, deleted: false, read: false }
    ];

    // Salva as mensagens no localStorage
    if (!localStorage.getItem('messages')) {
        localStorage.setItem('messages', JSON.stringify(messages));
    }

    loadMessages();
});

function loadMessages() {
    const messages = JSON.parse(localStorage.getItem('messages'));
    const messageList = document.querySelector('.message-list');
    messageList.innerHTML = '';

    messages.forEach(message => {
        if (!message.archived && !message.deleted) {
            const messageItem = document.createElement('div');
            messageItem.classList.add('message-item', message.read ? 'read' : 'unread');
            messageItem.innerHTML = `
                <div class="columns">
                    <div class="column is-10">
                        <span class="sender">${message.sender} - ${message.subject} -</span>
                        <span style="color: #888; font-weight: 400;">${message.body}</span>
                    </div>
                    <div class="column is-2 has-text-right">
                        <small>${message.date}</small>
                    </div>
                </div>
            `;
            messageItem.addEventListener('click', () => showMessage(message));
            messageItem.addEventListener('mouseover', () => messageItem.style.backgroundColor = '#e0e0e0');
            messageItem.addEventListener('mouseout', () => messageItem.style.backgroundColor = message.read ? '#fff' : '#f0f0f0');
            messageList.appendChild(messageItem);
        }
    });
}

function showMessage(message) {
    document.querySelector('.message-list-container').style.display = 'none';
    document.querySelector('.message-detail').style.display = 'block';

    document.getElementById('messageSubject').innerText = message.subject;
    document.getElementById('senderEmail').innerText = message.sender;
    document.getElementById('messageDate').innerText = message.date;
    document.querySelector('.message-detail-content').innerText = message.body;

    const senderImage = document.getElementById('senderImage');
    if (message.sender === 'alice@example.com') {
        senderImage.src = 'https://via.placeholder.com/32?text=A';
    } else if (message.sender === 'bob@example.com') {
        senderImage.src = 'https://via.placeholder.com/32?text=B';
    } else {
        senderImage.src = 'https://via.placeholder.com/32?text=U';
    }

    // Marcar a mensagem como lida
    const messages = JSON.parse(localStorage.getItem('messages'));
    const messageIndex = messages.findIndex(msg => msg.id == message.id);
    if (!messages[messageIndex].read) {
        messages[messageIndex].read = true;
        localStorage.setItem('messages', JSON.stringify(messages));
    }

    // Salvar mensagem atual em localStorage para ações futuras
    localStorage.setItem('currentMessageId', message.id);
}

function backToInbox() {
    document.querySelector('.message-list-container').style.display = 'block';
    document.querySelector('.message-detail').style.display = 'none';
}

function showReplyForwardSection(type) {
    const messageId = localStorage.getItem('currentMessageId');
    const messages = JSON.parse(localStorage.getItem('messages'));
    const message = messages.find(msg => msg.id == messageId);

    document.querySelector('.reply-forward-section').style.display = 'block';
    document.getElementById('replyForwardTitle').innerText = type === 'reply' ? 'Responder Mensagem' : 'Encaminhar Mensagem';
    document.getElementById('replyForwardTo').value = type === 'reply' ? message.sender : '';
    document.getElementById('replyForwardSubject').value = type === 'reply' ? `Re: ${message.subject}` : `Fwd: ${message.subject}`;
    document.getElementById('replyForwardBody').value = `\n\n----- Mensagem Original -----\nDe: ${message.sender}\nData: ${message.date}\nAssunto: ${message.subject}\n\n${message.body}`;
}

function sendReplyForward() {
    const to = document.getElementById('replyForwardTo').value;
    const subject = document.getElementById('replyForwardSubject').value;
    const body = document.getElementById('replyForwardBody').value;

    const messages = JSON.parse(localStorage.getItem('messages'));
    const newMessage = {
        id: messages.length + 1,
        subject: subject,
        sender: 'eu@example.com',
        date: new Date().toISOString().slice(0, 16).replace('T', ' '),
        body: body,
        archived: false,
        deleted: false
    };

    messages.push(newMessage);
    localStorage.setItem('messages', JSON.stringify(messages));
    document.querySelector('.reply-forward-section').style.display = 'none';
    loadMessages();
}

function deleteMessage() {
    const messageId = localStorage.getItem('currentMessageId');
    const messages = JSON.parse(localStorage.getItem('messages'));
    const messageIndex = messages.findIndex(msg => msg.id == messageId);
    messages[messageIndex].deleted = true;
    localStorage.setItem('messages', JSON.stringify(messages));
    backToInbox();
    loadMessages();
}

function archiveMessage() {
    const messageId = localStorage.getItem('currentMessageId');
    const messages = JSON.parse(localStorage.getItem('messages'));
    const messageIndex = messages.findIndex(msg => msg.id == messageId);
    messages[messageIndex].archived = true;
    localStorage.setItem('messages', JSON.stringify(messages));
    backToInbox();
    loadMessages();
}

function composeMessage() {
    document.getElementById('composeModalTitle').innerText = 'Nova Mensagem';
    document.getElementById('messageTo').value = '';
    document.getElementById('messageSubjectInput').value = '';
    document.getElementById('messageBody').value = '';
    
    toggleModal('composeModal');
}

function toggleModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.classList.toggle('is-active');
}

function sendMessage() {
    const to = document.getElementById('composeTo').value;
    const subject = document.getElementById('composeSubject').value;
    const body = document.getElementById('composeBody').value;

    const messages = JSON.parse(localStorage.getItem('messages'));
    const newMessage = {
        id: messages.length + 1,
        subject: subject,
        sender: 'eu@example.com',
        date: new Date().toISOString().slice(0, 16).replace('T', ' '),
        body: body,
        archived: false,
        deleted: false
    };

    messages.push(newMessage);
    localStorage.setItem('messages', JSON.stringify(messages));
    document.querySelector('.compose-section').style.display = 'none';
    loadMessages();
    backToInbox();
}
