        // Função para carregar os dados do visitante e o gráfico na página
        document.addEventListener('DOMContentLoaded', () => {
            const params = new URLSearchParams(window.location.search);
            const data = JSON.parse(decodeURIComponent(params.get('data')));
            const chartData = JSON.parse(decodeURIComponent(params.get('chartData')));

            // Preencher detalhes dos visitantes
            const visitorDetails = document.getElementById('visitorDetails');
            data.forEach(visitor => {
                visitorDetails.innerHTML += `
                    <div class="box">
                        <p><strong>Nome:</strong> ${visitor.nome}</p>
                        <p><strong>Data de Entrada:</strong> ${new Date(visitor.data_entrada).toLocaleDateString()}</p>
                        <p><strong>Hora de Entrada:</strong> ${visitor.hora_entrada}</p>
                        <p><strong>Data de Saída:</strong> ${visitor.data_saida ? new Date(visitor.data_saida).toLocaleDateString() : 'Ainda no local'}</p>
                        <p><strong>Hora de Saída:</strong> ${visitor.hora_saida || 'Ainda no local'}</p>
                        <p><strong>Motivo:</strong> ${visitor.motivo}</p>
                    </div>
                `;
            });

            // Gerar o gráfico com os dados fornecidos
            const ctx = document.getElementById('reportChart').getContext('2d');
            new Chart(ctx, {
                type: chartData.type,
                data: {
                    labels: chartData.labels,
                    datasets: [{
                        label: chartData.label,
                        data: chartData.data,
                        backgroundColor: chartData.backgroundColor,
                        borderColor: chartData.borderColor,
                        borderWidth: 1
                    }]
                },
                options: chartData.options
            });

            // Gerar e baixar PDF automaticamente
            setTimeout(() => {
                window.print();
            }, 1000);
        });