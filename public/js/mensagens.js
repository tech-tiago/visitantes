document.addEventListener('DOMContentLoaded', () => {
    loadMessages();
    initializeComposeModal();

    // document.getElementById('composeButton').addEventListener('click', composeMessage);
    document.getElementById('inboxLink').addEventListener('click', loadInbox);
    document.getElementById('sentLink').addEventListener('click', loadSent);
    document.getElementById('archivedLink').addEventListener('click', loadArchived);
    document.getElementById('deletedLink').addEventListener('click', loadDeleted);
});

// Definição da função showReplyForwardSection
function showReplyForwardSection(type) {
    const replyForwardSection = document.querySelector('.reply-forward-section');
    replyForwardSection.style.display = 'block';

    const replyForwardTitle = document.getElementById('replyForwardTitle');
    const replyForwardTo = document.getElementById('replyForwardTo');
    const replyForwardSubject = document.getElementById('replyForwardSubject');
    const replyForwardBody = document.getElementById('replyForwardBody');
    const senderName = document.getElementById('senderEmail').innerText;
    const messageDate = document.getElementById('messageDate').innerText;
    const messageSubject = document.getElementById('messageSubject').innerText;
    const messageContent = document.querySelector('.message-detail-content').innerText;

    if (type === 'reply') {
        replyForwardTitle.textContent = 'Responder';
        replyForwardTo.value = senderName;
        replyForwardSubject.value = 'Re: ' + messageSubject;
        replyForwardBody.value = `\n\n--- Mensagem Original ---\nDe: ${senderName}\nData: ${messageDate}\n\n${messageContent}`;
    } else if (type === 'forward') {
        replyForwardTitle.textContent = 'Encaminhar';
        replyForwardTo.value = '';
        replyForwardSubject.value = 'Fw: ' + messageSubject;
        replyForwardBody.value = `\n\n--- Mensagem Encaminhada ---\nDe: ${senderName}\nData: ${messageDate}\n\n${messageContent}`;
    }
}

    // Adiciona funcionalidade ao botão cancelar
    const cancelButton = document.getElementById('cancelButton');
    if (cancelButton) {
        cancelButton.addEventListener('click', () => {
            document.querySelector('.reply-forward-section').style.display = 'none';
        });
    } else {
        console.error('Elemento com ID "cancelButton" não encontrado.');
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
    // Remove a classe 'is-active' de todos os itens de menu
    document.querySelectorAll('.menu-item').forEach(item => {
        item.classList.remove('is-active');
    });
    // Adiciona a classe 'is-active' ao item de menu ativo
    document.getElementById(activeId).classList.add('is-active');
}

async function loadMessages(type = 'received') {
    const messages = await fetchMessages(`messages?type=${type}`);
    const messageList = document.querySelector('.message-list');
    messageList.innerHTML = '';

    // Atualiza a classe ativa no menu
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
        
        // Trunca o corpo da mensagem para mostrar apenas os primeiros 60 caracteres
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
        messageItem.addEventListener('click', () => showMessage(message));
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

async function showMessage(message) {
    document.querySelector('.message-list-container').style.display = 'none';
    document.querySelector('.message-detail').style.display = 'block';

    document.getElementById('messageSubject').innerText = message.subject;
    document.getElementById('senderEmail').innerText = message.sender.username;
    document.getElementById('messageDate').innerText = new Date(message.date).toLocaleString();
    document.querySelector('.message-detail-content').innerText = message.body;

    const senderPhoto = document.getElementById('senderPhoto');
    senderPhoto.src = 'images/' + message.sender.foto || 'path/to/default/photo.jpg'; 

    await markAsRead(message.id);
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

    document.querySelector('#messageTo').addEventListener('input', function(event) {
        const input = event.target.value;
        if (input.includes('@')) {
            const searchTerm = input.split('@').pop().trim();
            if (searchTerm.length > 0) {
                fetchUsers(searchTerm);  // Chama a função fetchUsers corretamente
            }
        }
    });    

    document.querySelector('#messageTo').addEventListener('blur', () => {
        setTimeout(() => {
            document.querySelector('.user-suggestions').style.display = 'none';
        }, 200);
    });
}

async function fetchUsers(query) {
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
        displayUserSuggestions(data);
    } catch (error) {
        console.error('Erro ao buscar usuários:', error);
    }
}

function displayUserSuggestions(users) {
    const suggestionsContainer = document.getElementById('userSuggestions');
    if (suggestionsContainer) {
        suggestionsContainer.innerHTML = '';
        users.forEach(user => {
            const userItem = document.createElement('div');
            userItem.textContent = user.nome;
            userItem.classList.add('suggestion-item');
            userItem.addEventListener('click', () => selectUser(user));
            suggestionsContainer.appendChild(userItem);
        });
        suggestionsContainer.style.display = 'block';
    } else {
        console.error('Elemento com ID "userSuggestions" não encontrado.');
    }
}

function selectUser(user) {
    const recipientField = document.querySelector('#messageTo');
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

    console.log('Updated recipientId:', recipientField.dataset.recipientId);

    document.querySelector('.user-suggestions').style.display = 'none';
}


async function sendMessage() {
    const recipientIds = document.querySelector('#messageTo').dataset.recipientId.split(',').map(id => id.trim());
    const subject = document.getElementById('messageSubjectInput').value.trim();
    const body = document.getElementById('messageBody').value.trim();
  
    if (!recipientIds.length || !subject || !body) {
      console.error('Parâmetros obrigatórios faltando.');
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
      } else {
        document.getElementById('composeModal').classList.remove('is-active');
        loadMessages(); // Recarrega as mensagens após enviar
      }
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
    }
  }  



function backToInbox() {
    document.querySelector('.message-list-container').style.display = 'block';
    document.querySelector('.message-detail').style.display = 'none';
}

function toggleModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.classList.toggle('is-active');
}
