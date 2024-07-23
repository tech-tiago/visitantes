document.addEventListener('DOMContentLoaded', () => {
    loadMessages();
    initializeComposeModal();
});

async function fetchMessages(endpoint) {
    const response = await fetch(`/api/${endpoint}`, {
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
    });
    return response.json();
}

async function loadMessages(type = 'received') {
    const messages = await fetchMessages(`messages?type=${type}`);
    const messageList = document.querySelector('.message-list');
    messageList.innerHTML = '';

    messages.forEach(message => {
        const messageItem = document.createElement('div');
        messageItem.classList.add('message-item', message.read ? 'read' : 'unread');
        messageItem.innerHTML = `
            <div class="columns">
                <div class="column is-10">
                    <span class="sender">${message.sender.username} - ${message.subject} -</span>
                    <span style="color: #888; font-weight: 400;">${message.body}</span>
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

async function showMessage(message) {
    document.querySelector('.message-list-container').style.display = 'none';
    document.querySelector('.message-detail').style.display = 'block';

    document.getElementById('messageSubject').innerText = message.subject;
    document.getElementById('senderEmail').innerText = message.sender.username;
    document.getElementById('messageDate').innerText = new Date(message.date).toLocaleString();
    document.querySelector('.message-detail-content').innerText = message.body;

    await markAsRead(message.id);
}

async function markAsRead(messageId) {
    await fetch(`/api/messages/${messageId}/read`, {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
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
                fetchUsers(searchTerm);
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
        const response = await fetch(`/api/users/search?query=${encodeURIComponent(query)}`, {
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
            userItem.textContent = user.username;
            userItem.classList.add('suggestion-item');
            userItem.addEventListener('click', () => selectUser(user.username));
            suggestionsContainer.appendChild(userItem);
        });
        suggestionsContainer.style.display = 'block';
    } else {
        console.error('Elemento com ID "userSuggestions" não encontrado.');
    }
}

function selectUser(username) {
    const recipientField = document.querySelector('#messageTo');
    const existingRecipients = recipientField.value.split(',').map(recipient => recipient.trim());
    
    if (!existingRecipients.includes(username)) {
        existingRecipients.push(username);
        recipientField.value = existingRecipients.join(', ');
    }

    document.querySelector('.user-suggestions').style.display = 'none';
}

async function sendMessage() {
    const to = document.getElementById('messageTo').value.split(',').map(recipient => recipient.trim());
    const subject = document.getElementById('messageSubjectInput').value;
    const body = document.getElementById('messageBody').value;

    await fetch('/api/messages', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ to, subject, body })
    });

    document.getElementById('composeModal').classList.remove('is-active');
    loadMessages(); // Reload messages after sending
}

function backToInbox() {
    document.querySelector('.message-list-container').style.display = 'block';
    document.querySelector('.message-detail').style.display = 'none';
}

function toggleModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.classList.toggle('is-active');
}
