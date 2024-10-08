$(document).ready(function() {
    var table = $('#openVisits').DataTable({
        "paging":   true,
        "ordering": false,
        "info":     true,
        "lengthChange": false,
        "pageLength": 10,
        language: {
            url: "https://cdn.datatables.net/plug-ins/1.11.3/i18n/pt_br.json"
        },
        ajax: {
            url: '/api/visitors/open',
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('token') // Assumindo que o token está armazenado no localStorage
            },
            dataSrc: function(json) {
                // Formatar as datas e horas para o formato PT-BR
                json.forEach(function(item) {
                    item.data_entrada = formatDatePTBR(item.data_entrada);
                    item.hora_entrada = formatTimeWithoutSeconds(item.hora_entrada);
                });
                return json;
            }
        },
        columns: [
            { data: 'nome' },
            { data: 'documento' },
            { data: 'data_entrada' },
            { data: 'hora_entrada' },
            { data: 'motivo' },
            {
                data: null,
                className: 'dt-center',
                defaultContent: '<button class="finalizar-btn button is-small is-primary"><i class="fa fa-check" aria-hidden="true"></i> Finalizar</button>'
            }
        ]
    });

    // Fechar modal ao clicar no fundo ou no botão de fechar
    $('#finalizeModal [data-close], .modal-background').on('click', function() {
        $('#finalizeModal').removeClass('is-active');
    });

    $('#openVisits').on('click', '.finalizar-btn', function() {
        var data = table.row($(this).parents('tr')).data();
        $('#dataSaida').val(new Date().toLocaleDateString('pt-BR'));
        $('#horaSaida').val(new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }));
        $('#finalizeModal').addClass('is-active');

        $('#finalizeForm').off('submit').on('submit', function(event) {
            event.preventDefault();
            const id = data.id;
            const data_saida = new Date().toISOString().split('T')[0];
            const hora_saida = new Date().toTimeString().split(':').slice(0, 2).join(':');
            
            fetch(`/api/visitors/close/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('token')
                },
                body: JSON.stringify({ data_saida, hora_saida })
            }).then(response => response.json())
              .then(data => {
                showAlert('Visita encerrada com sucesso!', 'is-success');
                  table.ajax.reload();
                  $('#finalizeModal').removeClass('is-active');
              }).catch(error => {
                  console.error('Error:', error);
                  showAlert('Erro ao encerrar a visita. Por favor, tente novamente.', 'is-danger');
              });
        });
    });

    $(document).on('click', '[data-close]', function() {
        $(this).closest('.modal').removeClass('is-active');
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
