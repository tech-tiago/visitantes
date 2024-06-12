$(document).ready(function() {
  var table = $('#closedVisits').DataTable({
    ajax: {
      url: '/api/visitors/closed',
      headers: {
        'Authorization': 'Bearer ' + localStorage.getItem('token')
      },
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

    var modal = new Foundation.Reveal($('#viewModal'));
    modal.open();
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
        alert('Visitante registrado com sucesso!');
        // Pode redirecionar ou realizar outra ação necessária
      },
      error: function(err) {
        console.error('Erro ao registrar visitante:', err);
        alert('Erro ao registrar visitante. Verifique o console para mais detalhes.');
      }
    });
  });
});
