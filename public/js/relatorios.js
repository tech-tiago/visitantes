document.addEventListener('DOMContentLoaded', () => {
    const generateReportButton = document.getElementById('generateReport');
    const reportContainer = document.getElementById('reportContainer');
    const reportChartCtx = document.getElementById('reportChart').getContext('2d');
    const chartTypeSelector = document.getElementById('chartType');
    const downloadWithChartButton = document.getElementById('downloadWithChart');
    const downloadWithoutChartButton = document.getElementById('downloadWithoutChart');

    let chartInstance;
    let responseData = []; // Inicializando a variável responseData

    generateReportButton.addEventListener('click', async () => {
        const startDate = document.getElementById('startDate').value;
        const endDate = document.getElementById('endDate').value;
        const chartType = chartTypeSelector.value;
    
        if (!startDate || !endDate) {
            showAlert('Por favor, selecione ambas as datas.');
            return;
        }
    
        try {
            const token = localStorage.getItem('token'); 
    
            if (!token) {
                showAlert('Token não encontrado. Por favor, faça login novamente.');
                return;
            }
    
            const response = await fetch(`/api/visitors/report?start=${startDate}&end=${endDate}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });            
    
            responseData = await response.json(); // Armazenando a resposta da API em responseData
            console.log("Resposta da API:", responseData);
    
            if (!Array.isArray(responseData) || responseData.length === 0) {
                showAlert('Nenhum dado encontrado para o período selecionado.');
                return;
            }
    
            // Organizar os dados para o gráfico
            const groupedData = responseData.reduce((acc, visitor) => {
                const date = new Date(visitor.data_entrada).toLocaleDateString();
                if (!acc[date]) acc[date] = 0;
                acc[date]++;
                return acc;
            }, {});

            const labels = Object.keys(groupedData).sort((a, b) => new Date(a) - new Date(b));
            const dataSet = labels.map(label => groupedData[label]);

            if (chartInstance) {
                chartInstance.destroy(); // Destroi gráfico anterior antes de criar novo
            }

            // Gerar o gráfico com base no tipo selecionado
            chartInstance = new Chart(reportChartCtx, {
                type: chartType,
                data: {
                    labels: labels,
                    datasets: [{
                        label: 'Visitantes por Data',
                        data: dataSet,
                        backgroundColor: chartType === 'pie' ? 
                            labels.map(() => `rgba(${Math.floor(Math.random()*255)}, ${Math.floor(Math.random()*255)}, ${Math.floor(Math.random()*255)}, 0.2)`) : 
                            'rgba(75, 192, 192, 0.2)',
                        borderColor: 'rgba(75, 192, 192, 1)',
                        borderWidth: 1
                    }]
                },
                options: {
                    scales: chartType !== 'pie' ? {
                        y: {
                            beginAtZero: true
                        }
                    } : {},
                    plugins: {
                        tooltip: {
                            callbacks: {
                                label: function(tooltipItem) {
                                    return `Visitantes: ${tooltipItem.raw}`;
                                }
                            }
                        },
                        datalabels: {
                            anchor: 'end',
                            align: 'end',
                            color: '#444',
                            font: {
                                weight: 'bold'
                            }
                        }
                    }
                },
                plugins: [ChartDataLabels]
            });
    
            reportContainer.style.display = 'block';
        } catch (error) {
            console.error('Erro ao gerar relatório:', error);
            showAlert('Erro ao gerar relatório. Tente novamente.');
        }
    });

    downloadWithoutChartButton.addEventListener('click', () => {
        if (!responseData.length) {
            showAlert('Nenhum dado disponível para gerar o relatório.');
            return;
        }
    
        // Preparar a página para impressão
        const printWindow = window.open('', '_blank');
        printWindow.document.write('<html><head><title>Relatório de Visitantes</title>');
        printWindow.document.write('<link rel="stylesheet" href="../css/relatorios.css">'); // Adicione os estilos necessários
        printWindow.document.write('<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bulma@0.9.3/css/bulma.min.css">'); // Link para Bulma
        printWindow.document.write('<style>');
        printWindow.document.write('@media print { @page { size: landscape; } }'); // Forçar modo paisagem
        printWindow.document.write('</style>');
        printWindow.document.write('</head><body>');
        
        // Adicionar o título do relatório
        printWindow.document.write('<h1 class="title has-text-centered">Relatório de Visitantes</h1>');
        
        // Adicionar a tabela com os detalhes dos visitantes
        printWindow.document.write('<table class="table is-striped is-hoverable is-fullwidth">');
        printWindow.document.write('<thead>');
        printWindow.document.write('<tr>');
        printWindow.document.write('<th>Nome</th>');
        printWindow.document.write('<th>Data de Entrada</th>');
        printWindow.document.write('<th>Hora de Entrada</th>');
        printWindow.document.write('<th>Data de Saída</th>');
        printWindow.document.write('<th>Hora de Saída</th>');
        printWindow.document.write('<th>Motivo</th>');
        printWindow.document.write('</tr>');
        printWindow.document.write('</thead>');
        printWindow.document.write('<tbody>');
        
        responseData.forEach(visitor => {
            printWindow.document.write(`
                <tr>
                    <td>${visitor.nome}</td>
                    <td>${new Date(visitor.data_entrada).toLocaleDateString()}</td>
                    <td>${visitor.hora_entrada}</td>
                    <td>${visitor.data_saida ? new Date(visitor.data_saida).toLocaleDateString() : 'Ainda no local'}</td>
                    <td>${visitor.hora_saida || 'Ainda no local'}</td>
                    <td>${visitor.motivo}</td>
                </tr>
            `);
        });
    
        printWindow.document.write('</tbody>');
        printWindow.document.write('</table>');
    
        // Adicionar o gráfico se necessário
        if (chartInstance) {
            const chartDataUrl = chartInstance.toBase64Image();
            printWindow.document.write('<div class="has-text-centered" style="margin-top: 20px;">');
            printWindow.document.write(`<img src="${chartDataUrl}" alt="Gráfico">`);
            printWindow.document.write('</div>');
        }
    
        printWindow.document.write('</body></html>');
        printWindow.document.close();
        
        // Esperar o documento estar pronto para imprimir
        printWindow.onload = function () {
            printWindow.focus();
            printWindow.print();
            printWindow.close();
        };
    });
    
    
});
