$(document).ready(function() {
  var table = $('#closedVisits').DataTable({
      ajax: {
          url: '/api/visitors/closed',
          dataSrc: ''
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
              defaultContent: '<button class="ver-btn button">Ver</button>'
          }
      ]
  });

  $('#closedVisits').on('click', '.ver-btn', function() {
      var data = table.row($(this).parents('tr')).data();
      $('#viewNome').text(data.nome);
      $('#viewDocumento').text(data.documento);
      $('#viewDataEntrada').text(data.data_entrada);
      $('#viewHoraEntrada').text(data.hora_entrada);
      $('#viewDataSaida').text(data.data_saida);
      $('#viewHoraSaida').text(data.hora_saida);
      $('#viewMotivo').text(data.motivo);
      $('#viewFoto').attr('src', data.foto);
      var modal = new Foundation.Reveal($('#viewModal'));
      modal.open();
  });
});
