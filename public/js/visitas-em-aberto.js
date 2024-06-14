$(document).ready(function() {
    var table = $('#openVisits').DataTable({
        paging: false,
        ordering: false,
        info: false,
        pageLength: 50,
        language: {
            url: "https://cdn.datatables.net/plug-ins/1.11.3/i18n/pt_br.json"
        },
        ajax: {
            url: '/api/visitors/open',
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('token') // Assumindo que o token está armazenado no localStorage
            },
            dataSrc: ''
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
        $('#dataSaida').val(new Date().toLocaleDateString());
        $('#horaSaida').val(new Date().toLocaleTimeString());
        $('#finalizeModal').addClass('is-active');

        $('#finalizeForm').off('submit').on('submit', function(event) {
            event.preventDefault();
            const id = data.id;
            const data_saida = new Date().toISOString().split('T')[0];
            const hora_saida = new Date().toTimeString().split(' ')[0];
            
            fetch(`/api/visitors/close/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('token')
                },
                body: JSON.stringify({ data_saida, hora_saida })
            }).then(response => response.json())
              .then(data => {
                  alert('Visita encerrada com sucesso!');
                  table.ajax.reload();
                  $('#finalizeModal').removeClass('is-active');
              }).catch(error => {
                  console.error('Error:', error);
                  alert('Erro ao encerrar a visita. Por favor, tente novamente.');
              });
        });
    });

    $(document).on('click', '[data-close]', function() {
        $(this).closest('.modal').removeClass('is-active');
    });
});
