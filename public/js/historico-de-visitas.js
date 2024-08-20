$(document).ready(function() {
    var table = $('#closedVisits').DataTable({
        "paging":   true,
        "ordering": false,
        "info":     true,
        "lengthChange": false,
        "pageLength": 20,
        "order": [[2, 'asc']],
        language: {
          url:"https://cdn.datatables.net/plug-ins/1.11.3/i18n/pt_br.json"
        },
        ajax: {
            url: '/api/visitors/closed',
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            },
            dataSrc: function(json) {
                // Formatar as datas e horas para o formato PT-BR
                json.forEach(function(item) {
                    item.data_entrada = formatDatePTBR(item.data_entrada);
                    item.data_saida = formatDatePTBR(item.data_saida);
                    item.hora_entrada = formatTimeWithoutSeconds(item.hora_entrada);
                    item.hora_saida = formatTimeWithoutSeconds(item.hora_saida);
                });
                return json;
            }
        },
        columns: [
            { data: 'nome' },
            { data: 'documento' },
            { data: 'data_entrada' },
            { data: 'hora_entrada' },
            { data: 'data_saida' },
            { data: 'hora_saida' },
            { data: 'motivo' },
            {
                data: null,
                className: 'dt-center',
                width: '250px',
                defaultContent: '<button class="ver-btn button is-small is-primary"><i class="fa fa-eye" aria-hidden="true"></i><span>Ver</span></button>' +
                                '<button class="edit-btn button is-small is-warning"><i class="fa fa-edit" aria-hidden="true"></i><span>Editar</span></button>'+
                                '<button class="delete-btn button is-small is-danger"><i class="fa fa-trash" aria-hidden="true"></i><span>Deletar</span></button>'
            }
        ],
        responsive: true
    });


// Abrir modal de confirmação ao clicar no botão de deletar
$('#closedVisits').on('click', '.delete-btn', function() {
    var data = table.row($(this).parents('tr')).data();
    $('#visitorNameToDelete').text(data.nome); // Define o nome do visitante no modal

    // Mostrar modal
    $('#confirmDeleteModal').addClass('is-active');

    // Ação ao clicar em confirmar
    $('#confirmDeleteButton').on('click', function() {
        const visitorId = data.id;
        const token = localStorage.getItem('token');
        if (!token) {
            console.error('Token de autenticação não encontrado.');
            return;
        }

        $.ajax({
            type: 'DELETE',
            url: `/api/visitors/${visitorId}`,
            headers: {
                'Authorization': `Bearer ${token}`
            },
            success: function(response) {
                console.log('Visitante deletado com sucesso:', response);
                showAlert('Visitante deletado com sucesso!', 'is-success');
                table.ajax.reload(); // Recarrega a tabela
                $('#confirmDeleteModal').removeClass('is-active'); // Fecha o modal
            },
            error: function(err) {
                console.error('Erro ao deletar visitante:', err);
                showAlert('Erro ao deletar visitante. Verifique o console para mais detalhes.', 'is-danger');
                $('#confirmDeleteModal').removeClass('is-active'); // Fecha o modal
            }
        });
    });

    // Fechar modal ao clicar no fundo ou no botão de fechar
    $('#confirmDeleteModal').on('click', function(event) {
        if ($(event.target).hasClass('modal-background') || $(event.target).hasClass('delete')) {
            $('#confirmDeleteModal').removeClass('is-active');
        }
    });

    // Fechar modal ao clicar em cancelar
    $('#cancelDeleteButton').on('click', function() {
        $('#confirmDeleteModal').removeClass('is-active');
    });
});



    $('#closedVisits').on('click', '.edit-btn', function() {
        var data = table.row($(this).parents('tr')).data();
        
        // Preencher os dados no modal
        $('#editVisitorForm').data('visitor-id', data.id); // Armazena o ID do visitante no formulário
        $('#editNomeCompleto').val(data.nome);
        $('#editDocumento').val(data.documento);
        $('#editMotivoVisita').val(data.motivo);
        $('#editDataEntrada').val(data.data_entrada.split('/').reverse().join('-'));
        $('#editHoraEntrada').val(data.hora_entrada);
        $('#editDataSaida').val(data.data_saida.split('/').reverse().join('-'));
        $('#editHoraSaida').val(data.hora_saida);
    
        var modal = document.getElementById('editModal');
        modal.classList.add('is-active');
    });
    
    // Fechar modal ao clicar no fundo ou no botão de fechar
    $('#editModal [data-close], .modal-background').on('click', function() {
        $('#editModal').removeClass('is-active');
    });
    
    // Evento de clique no botão salvar
    $('#saveEditVisitor').on('click', function(event) {
        event.preventDefault();
    
        // Recuperar o ID do visitante e outros dados do formulário
        const visitorId = $('#editVisitorForm').data('visitor-id');
        const nome = $('#editNomeCompleto').val();
        const documento = $('#editDocumento').val();
        const motivo = $('#editMotivoVisita').val();
        const data_entrada = $('#editDataEntrada').val();
        const hora_entrada = $('#editHoraEntrada').val();
        const data_saida = $('#editDataSaida').val();
        const hora_saida = $('#editHoraSaida').val();
    
        // Recuperar o token do localStorage
        const token = localStorage.getItem('token');
        if (!token) {
            console.error('Token de autenticação não encontrado.');
            return;
        }
    
        // Enviar a requisição PUT para a API
        $.ajax({
            type: 'PUT',
            url: `/api/visitors/${visitorId}`,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            data: JSON.stringify({ nome, documento, data_entrada, hora_entrada, motivo, data_saida, hora_saida }),
            success: function(response) {
                console.log('Visitante atualizado com sucesso:', response);
                showAlert('Visitante atualizado com sucesso!', 'is-success');
                table.ajax.reload(); // Recarrega a tabela
                $('#editModal').removeClass('is-active'); // Fecha o modal
            },
            error: function(err) {
                console.error('Erro ao atualizar visitante:', err);
                showAlert('Erro ao atualizar visitante. Verifique o console para mais detalhes.', 'is-danger');
            }
        });
    });
    
    // Modal para visualizar
    $('#closedVisits').on('click', '.ver-btn', function() {
        var data = table.row($(this).parents('tr')).data();
        console.log(data.foto); // Adicionado para debug

        // Preencher os dados no modal
        $('#viewNome').text(data.nome);
        $('#viewDocumento').text(data.documento);
        $('#viewDataEntrada').text(data.data_entrada);
        $('#viewHoraEntrada').text(data.hora_entrada);
        $('#viewDataSaida').text(data.data_saida);
        $('#viewHoraSaida').text(data.hora_saida);
        $('#viewMotivo').text(data.motivo);

        // Exibir a imagem
        if (data.foto) {
            // Verificar se o caminho da imagem já começa com '/uploads/'
            var imagePath = data.foto.startsWith('/uploads/') ? data.foto : '/uploads/' + data.foto;
            $('#viewFoto').attr('src', imagePath);
        } else {
            $('#viewFoto').attr('src', ''); // Limpa o src se não houver foto
        }

        var modal = document.getElementById('viewModal');
        modal.classList.add('is-active');
    });

    // Fechar modal ao clicar no fundo ou no botão de fechar
    $('#viewModal [data-close], .modal-background').on('click', function() {
        $('#viewModal').removeClass('is-active');
    });

    // Evento de submit do formulário de registro de visitantes
    $('#visitorForm').on('submit', function(event) {
        event.preventDefault();
        const nome = $('#nomeCompleto').val();
        const documento = $('#documento').val();
        const motivo = $('#motivoVisita').val();
        const data_entrada = $('#dataEntrada').val();
        const hora_entrada = $('#horaEntrada').val();
        const foto = $('#fotoInput').val(); // Obtém a foto como base64 do input hidden

        // Recuperar o token do localStorage
        const token = localStorage.getItem('token');
        if (!token) {
            console.error('Token de autenticação não encontrado.');
            return;
        }

        // Enviar a requisição POST para a API
        $.ajax({
            type: 'POST',
            url: '/api/visitors',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            data: JSON.stringify({ nome, documento, data_entrada, hora_entrada, foto, motivo }),
            success: function(response) {
                console.log('Visitante registrado com sucesso:', response);
                showAlert('Visitante registrado com sucesso!', 'is-success');
                // Pode redirecionar ou realizar outra ação necessária
            },
            error: function(err) {
                console.error('Erro ao registrar visitante:', err);
                showAlert('Erro ao registrar visitante. Verifique o console para mais detalhes.', 'is-danger');
            }
        });
    });

    // Logout button action
    $('#logoutButton').on('click', function() {
        localStorage.removeItem('token');
        window.location.href = '/login'; // Redirecionar para a página de login
    });

    // Modal close button action
    $(document).on('click', '[data-close]', function() {
        var modal = document.getElementById('viewModal');
        modal.classList.remove('is-active');
    });
});

function formatDatePTBR(dateStr) {
    if (!dateStr) return '';

    // Cria um objeto Date a partir da string da data
    const date = new Date(dateStr);

    // Ajusta para o fuso horário local para evitar discrepâncias
    const localDate = new Date(date.getTime() + date.getTimezoneOffset() * 60000);

    const day = localDate.getDate().toString().padStart(2, '0');
    const month = (localDate.getMonth() + 1).toString().padStart(2, '0'); // Mês começa em 0
    const year = localDate.getFullYear();

    return `${day}/${month}/${year}`;
}

function formatTimeWithoutSeconds(timeStr) {
    if (!timeStr) return '';

    // Supondo que o formato original seja HH:mm:ss
    const timeParts = timeStr.split(':');
    if (timeParts.length >= 2) {
        return `${timeParts[0]}:${timeParts[1]}`;
    }

    return timeStr; // Se o formato não for esperado, retornar como está
}
