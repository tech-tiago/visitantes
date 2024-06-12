$(document).ready(function() {
  var table = $('#openVisits').DataTable({
      ajax: {
          url: '/api/visitors/open',
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
              defaultContent: '<button class="finalizar-btn button">Finalizar</button>'
          }
      ]
  });

  $('#openVisits').on('click', '.finalizar-btn', function() {
      var data = table.row($(this).parents('tr')).data();
      $('#dataSaida').val(new Date().toLocaleDateString());
      $('#horaSaida').val(new Date().toLocaleTimeString());
      var modal = new Foundation.Reveal($('#finalizeModal'));
      modal.open();

      $('#finalizeForm').on('submit', function(event) {
          event.preventDefault();
          const id = data.id;
          const data_saida = new Date().toISOString().split('T')[0];
          const hora_saida = new Date().toTimeString().split(' ')[0];
          
          fetch(`/api/visitors/close/${id}`, {
              method: 'PUT',
              headers: {
                  'Content-Type': 'application/json'
              },
              body: JSON.stringify({ data_saida, hora_saida })
          }).then(response => response.json())
            .then(data => {
                alert('Visita encerrada com sucesso!');
                table.ajax.reload();
            }).catch(error => {
                console.error('Error:', error);
            });
      });
  });
});
