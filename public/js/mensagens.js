document.addEventListener('DOMContentLoaded', () => {
    initializeComposeModal();

    document.getElementById('inboxLink').addEventListener('click', () => {
        backToInbox();
        loadInbox();
    });
    document.getElementById('sentLink').addEventListener('click', () => {
        backToInbox();
        loadSent();
    });
    document.getElementById('archivedLink').addEventListener('click', () => {
        backToInbox();
        loadArchived();
    });
    document.getElementById('deletedLink').addEventListener('click', () => {
        backToInbox();
        loadDeleted();
    });

    loadMessages('received');
});

function showReplyForwardSection(type) {
    const replyForwardSection = document.querySelector('.reply-forward-section');
    replyForwardSection.style.display = 'block';

    const replyForwardTitle = document.getElementById('replyForwardTitle');
    const replyForwardTo = document.getElementById('replyForwardTo');
    const replyForwardSubject = document.getElementById('replyForwardSubject');
    const replyForwardBody = document.getElementById('replyForwardBody');
    const senderName = document.getElementById('senderEmail').innerText;
    const senderId = document.getElementById('senderEmail').dataset.senderId;
    const messageDate = document.getElementById('messageDate').innerText;
    const messageSubject = document.getElementById('messageSubject').innerText;
    const messageContent = document.querySelector('.message-detail-content').innerText;

    const sendReplyButton = document.querySelector('.send-reply-button');
    const sendForwardButton = document.querySelector('.send-forward-button');

    if (type === 'reply') {
        replyForwardTitle.textContent = 'Responder';
        replyForwardTo.value = '@' + senderName;
        replyForwardTo.dataset.recipientId = senderId;
        replyForwardTo.readOnly = true;
        replyForwardSubject.value = 'Re: ' + messageSubject;
        replyForwardSubject.readOnly = true;
        replyForwardBody.value = `\n\n--- Mensagem Original ---\nDe: ${senderName}\nData: ${messageDate}\n\n${messageContent}`;
        sendReplyButton.style.display = 'block';
        sendForwardButton.style.display = 'none';
        replyForwardTo.removeEventListener('input', handleInput);
    } else if (type === 'forward') {
        replyForwardTitle.textContent = 'Encaminhar';
        replyForwardTo.value = '';
        replyForwardTo.dataset.recipientId = '';
        replyForwardTo.readOnly = false;
        replyForwardSubject.value = 'Fw: ' + messageSubject;
        replyForwardSubject.readOnly = false;
        replyForwardBody.value = `\n\n--- Mensagem Encaminhada ---\nDe: ${senderName}\nData: ${messageDate}\n\n${messageContent}`;
        sendReplyButton.style.display = 'none';
        sendForwardButton.style.display = 'block';
        replyForwardTo.addEventListener('input', (event) => handleInput(event, 'replyUserSuggestions'));
    }
}

async function showMessage(message, type) {
    document.querySelector('.message-list-container').style.display = 'none';
    document.querySelector('.message-detail').style.display = 'block';

    document.getElementById('messageSubject').innerText = message.subject;
    document.getElementById('senderEmail').innerText = message.sender.username;
    document.getElementById('senderEmail').dataset.senderId = message.sender.id;
    document.getElementById('messageDate').innerText = new Date(message.date).toLocaleString();
    document.querySelector('.message-detail-content').innerText = message.body;

    const senderPhoto = document.getElementById('senderPhoto');
    senderPhoto.src = 'images/' + message.sender.foto || 'path/to/default/photo.jpg';

    await markAsRead(message.id);

    const replyButton = document.querySelector('.reply-button');
    const forwardButton = document.querySelector('.forward-button');
    const archiveButton = document.querySelector('.archive-button');
    const deleteButton = document.querySelector('.delete-button');
    const moveToInboxButton = document.querySelector('.move-to-inbox-button');
    const permanentlyDeleteButton = document.querySelector('.permanently-delete-button');

    // Reset button visibility
    replyButton.style.display = 'none';
    forwardButton.style.display = 'none';
    archiveButton.style.display = 'none';
    deleteButton.style.display = 'none';
    moveToInboxButton.style.display = 'none';
    permanentlyDeleteButton.style.display = 'none';

    if (type === 'received') {
        replyButton.style.display = 'inline-block';
        forwardButton.style.display = 'inline-block';
        archiveButton.style.display = 'inline-block';
        deleteButton.style.display = 'inline-block';
    } else if (type === 'sent') {
        permanentlyDeleteButton.style.display = 'inline-block';
    } else if (type === 'archived') {
        deleteButton.style.display = 'inline-block';
        moveToInboxButton.style.display = 'inline-block';
    } else if (type === 'deleted') {
        moveToInboxButton.style.display = 'inline-block';
        permanentlyDeleteButton.style.display = 'inline-block';
    }

    document.querySelector('.archive-button').onclick = () => {
        archiveMessage(message.id);
        backToInbox();
    };
    document.querySelector('.delete-button').onclick = () => {
        deleteMessage(message.id);
        backToInbox();
    };
    document.querySelector('.move-to-inbox-button').onclick = () => {
        moveToInbox(message.id);
        backToInbox();
    };
    document.querySelector('.permanently-delete-button').onclick = () => {
        showModalConfirmDelete(message.id);
    };
}


async function fetchMessages(endpoint) {
    const response = await fetch(`/api/${endpoint}`, {
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
    });
    return response.json();
}

function updateMenuActiveClass(activeId) {
    document.querySelectorAll('.menu-item').forEach(item => {
        item.classList.remove('is-active');
    });
    document.getElementById(activeId).classList.add('is-active');
}

async function loadMessages(type = 'received') {
    let endpoint;
    if (type === 'sent') {
        endpoint = 'messages?type=sent';
    } else {
        endpoint = `messages?type=${type}`;
    }
    const messages = await fetchMessages(endpoint);
    const messageList = document.querySelector('.message-list');
    messageList.innerHTML = '';

    switch(type) {
        case 'received':
            updateMenuActiveClass('inboxLink');
            break;
        case 'sent':
            updateMenuActiveClass('sentLink');
            break;
        case 'archived':
            updateMenuActiveClass('archivedLink');
            break;
        case 'deleted':
            updateMenuActiveClass('deletedLink');
            break;
    }

    messages.forEach(message => {
        const messageItem = document.createElement('div');
        messageItem.classList.add('message-item', message.read ? 'read' : 'unread');

        const truncatedBody = message.body.length > 60 ? message.body.substring(0, 60) + '...' : message.body;

        messageItem.innerHTML = `
            <div class="columns">
                <div class="column is-10">
                    <span class="sender">${message.sender.username} - ${message.subject} -</span>
                    <span style="color: #888; font-weight: 400;">${truncatedBody}</span>
                </div>
                <div class="column is-2 has-text-right">
                    <small>${new Date(message.date).toLocaleString()}</small>
                </div>
            </div>
        `;
        messageItem.addEventListener('click', () => showMessage(message, type));
        messageItem.addEventListener('mouseover', () => messageItem.style.backgroundColor = '#e0e0e0');
        messageItem.addEventListener('mouseout', () => messageItem.style.backgroundColor = message.read ? '#fff' : '#f0f0f0');
        messageList.appendChild(messageItem);
    });
}

  function loadInbox() {
    loadMessages('received');
  }
  
  function loadSent() {
    loadMessages('sent');
  }
  
  function loadArchived() {
    loadMessages('archived');
  }
  
  function loadDeleted() {
    loadMessages('deleted');
  }  

async function markAsRead(messageId) {
    const response = await fetch(`/api/messages/${messageId}/read`, {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
    });
    if (!response.ok) {
        console.error(`Erro ao marcar a mensagem como lida: ${response.statusText}`);
    }
}

function composeMessage() {
    document.getElementById('composeModal').classList.add('is-active');
}

function initializeComposeModal() {
    document.querySelector('.button.is-success').addEventListener('click', () => {
        document.getElementById('composeModal').classList.add('is-active');
    });

    document.querySelector('.modal .delete').addEventListener('click', () => {
        document.getElementById('composeModal').classList.remove('is-active');
    });

    document.querySelector('#messageTo').addEventListener('input', (event) => handleInput(event, 'composeUserSuggestions'));

    document.querySelector('#messageTo').addEventListener('blur', () => {
        setTimeout(() => {
            document.querySelector('#composeUserSuggestions').style.display = 'none';
        }, 200);
    });

    document.querySelector('#replyForwardTo').addEventListener('blur', () => {
        setTimeout(() => {
            document.querySelector('#replyUserSuggestions').style.display = 'none';
        }, 200);
    });
}

function handleInput(event, suggestionsId) {
    const input = event.target.value;
    if (input.includes('@')) {
        const searchTerm = input.split('@').pop().trim();
        if (searchTerm.length > 0) {
            fetchUsers(searchTerm, suggestionsId);
        }
    }
}

async function fetchUsers(query, suggestionsId) {
    try {
        const response = await fetch(`/api/auth/users/search?query=${encodeURIComponent(query)}`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        if (!response.ok) {
            throw new Error(`Erro HTTP ${response.status}`);
        }
        const data = await response.json();
        displayUserSuggestions(data, suggestionsId);
    } catch (error) {
        console.error('Erro ao buscar usuários:', error);
    }
}

function displayUserSuggestions(users, suggestionsId) {
    const suggestionsContainer = document.getElementById(suggestionsId);
    if (suggestionsContainer) {
        suggestionsContainer.innerHTML = '';
        users.forEach(user => {
            const userItem = document.createElement('div');
            userItem.textContent = user.nome;
            userItem.classList.add('suggestion-item');
            userItem.addEventListener('click', () => selectUser(user, suggestionsId));
            suggestionsContainer.appendChild(userItem);
        });
        suggestionsContainer.style.display = 'block';
    } else {
        console.error(`Elemento com ID "${suggestionsId}" não encontrado.`);
    }
}

function selectUser(user, suggestionsId) {
    const recipientField = document.querySelector(`#${suggestionsId}`).previousElementSibling;
    const currentText = recipientField.value;
    const lastAtIndex = currentText.lastIndexOf('@');

    if (lastAtIndex === -1) {
        recipientField.value = `${currentText}${user.nome}`;
    } else {
        const textBeforeAt = currentText.substring(0, lastAtIndex + 1);
        recipientField.value = `${textBeforeAt}${user.nome}, `;
    }

    let recipientIds = recipientField.dataset.recipientId ? recipientField.dataset.recipientId.split(',').map(id => id.trim()) : [];
    if (!recipientIds.includes(user.id)) {
        recipientIds.push(user.id);
        recipientField.dataset.recipientId = recipientIds.join(', ');
    }

    document.querySelector(`#${suggestionsId}`).style.display = 'none';
}

async function sendMessage() {
    const recipientIds = document.querySelector('#messageTo').dataset.recipientId.split(',').map(id => id.trim());
    const subject = document.getElementById('messageSubjectInput').value.trim();
    const body = document.getElementById('messageBody').value.trim();

    if (!recipientIds.length || !subject || !body) {
        console.error('Parâmetros obrigatórios faltando.');
        showNotification('Parâmetros obrigatórios faltando.', 'is-danger');
        return;
    }

    try {
        const response = await fetch('/api/messages', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ to: recipientIds, subject, body })
        });

        if (!response.ok) {
            const error = await response.json();
            console.error('Erro ao enviar mensagem:', error);
            showNotification('Erro ao enviar mensagem.', 'is-danger');
        } else {
            document.querySelector('.modal.is-active').classList.remove('is-active');
            loadMessages('received');
            showNotification('Mensagem enviada com sucesso!', 'is-success');
        }
    } catch (error) {
        console.error('Erro ao enviar mensagem:', error);
        showNotification('Erro ao enviar mensagem.', 'is-danger');
    }
}

async function sendReplyMessage() {
    const recipientId = document.querySelector('#replyForwardTo').dataset.recipientId;
    const subject = document.getElementById('replyForwardSubject').value.trim();
    const body = document.getElementById('replyForwardBody').value.trim();

    if (!recipientId || !subject || !body) {
        console.error('Parâmetros obrigatórios faltando.');
        showNotification('Parâmetros obrigatórios faltando.', 'is-danger');
        return;
    }

    try {
        const response = await fetch('/api/messages', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ to: [recipientId], subject, body, isReply: true })
        });

        if (!response.ok) {
            const error = await response.json();
            console.error('Erro ao enviar mensagem:', error);
            showNotification('Erro ao enviar mensagem.', 'is-danger');
            return;
        }

        document.querySelector('.reply-forward-section').style.display = 'none';
        loadMessages('received');
        showNotification('Resposta enviada com sucesso!', 'is-success');
    } catch (error) {
        console.error('Erro ao enviar mensagem:', error);
        showNotification('Erro ao enviar mensagem.', 'is-danger');
    }
}

async function sendForwardMessage() {
    const recipientIds = document.querySelector('#replyForwardTo').dataset.recipientId.split(',').map(id => id.trim());
    const subject = document.getElementById('replyForwardSubject').value.trim();
    const body = document.getElementById('replyForwardBody').value.trim();

    if (!recipientIds.length || !subject || !body) {
        console.error('Parâmetros obrigatórios faltando.');
        showNotification('Parâmetros obrigatórios faltando.', 'is-danger');
        return;
    }

    try {
        const response = await fetch('/api/messages', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ to: recipientIds, subject, body, isForward: true })
        });

        if (!response.ok) {
            const error = await response.json();
            console.error('Erro ao encaminhar mensagem:', error);
            showNotification('Erro ao encaminhar mensagem.', 'is-danger');
            return;
        }

        document.querySelector('.reply-forward-section').style.display = 'none';
        loadMessages('received');
        showNotification('Mensagem encaminhada com sucesso!', 'is-success');
    } catch (error) {
        console.error('Erro ao encaminhar mensagem:', error);
        showNotification('Erro ao encaminhar mensagem.', 'is-danger');
    }
}

async function archiveMessage(messageId) {
    try {
        const response = await fetch(`/api/messages/${messageId}/archive`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        if (response.ok) {
            loadMessages('received');
            showNotification('Mensagem arquivada com sucesso!', 'is-success');
        } else {
            console.error('Erro ao arquivar mensagem');
            showNotification('Erro ao arquivar mensagem.', 'is-danger');
        }
    } catch (error) {
        console.error('Erro ao arquivar mensagem:', error);
        showNotification('Erro ao arquivar mensagem.', 'is-danger');
    }
}

async function deleteMessage(messageId) {
    try {
        const response = await fetch(`/api/messages/${messageId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        if (response.ok) {
            loadMessages('received');
            showNotification('Mensagem movida para a lixeira com sucesso!', 'is-success');
        } else {
            console.error('Erro ao excluir mensagem');
            showNotification('Erro ao mover a mensagem para a lixeira.', 'is-danger');
        }
    } catch (error) {
        console.error('Erro ao excluir mensagem:', error);
        showNotification('Erro ao mover a mensagem para a lixeira.', 'is-danger');
    }
}

async function moveToInbox(messageId) {
    try {
        const response = await fetch(`/api/messages/${messageId}/moveToInbox`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        if (response.ok) {
            loadMessages('received');
            showNotification('Mensagem movida para a Caixa de Entrada com sucesso!', 'is-success');
        } else {
            console.error('Erro ao mover mensagem para a Caixa de Entrada');
            showNotification('Erro ao mover a mensagem para a Caixa de Entrada.', 'is-danger');
        }
    } catch (error) {
        console.error('Erro ao mover mensagem para a Caixa de Entrada:', error);
        showNotification('Erro ao mover a mensagem para a Caixa de Entrada.', 'is-danger');
    }
}

async function permanentlyDeleteMessage(messageId) {
    try {
        const response = await fetch(`/api/messages/${messageId}/permanentDelete`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        if (response.ok) {
            loadMessages('deleted');
            showNotification('Mensagem excluída permanentemente com sucesso!', 'is-success');
        } else {
            console.error('Erro ao excluir permanentemente a mensagem');
            showNotification('Erro ao excluir permanentemente a mensagem.', 'is-danger');
        }
    } catch (error) {
        console.error('Erro ao excluir permanentemente a mensagem:', error);
        showNotification('Erro ao excluir permanentemente a mensagem.', 'is-danger');
    }
}

function backToInbox() {
    document.querySelector('.message-list-container').style.display = 'block';
    document.querySelector('.message-detail').style.display = 'none';
}

function hideReplyForwardSection() {
    document.querySelector('.reply-forward-section').style.display = 'none';
}

function toggleModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.classList.toggle('is-active');
}

function showModalConfirmDelete(messageId) {
    const modal = document.getElementById('confirmDeleteModal');
    modal.classList.add('is-active');

    document.getElementById('confirmDeleteButton').onclick = () => {
        permanentlyDeleteMessage(messageId);
        modal.classList.remove('is-active');
    };

    document.getElementById('cancelDeleteButton').onclick = () => {
        modal.classList.remove('is-active');
    };
}

function showNotification(message, type = 'is-info') {
    const notificationContainer = document.getElementById('notificationContainer');
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

    // Remover a notificação após 5 segundos
    setTimeout(() => {
        notification.remove();
    }, 5000);
}
