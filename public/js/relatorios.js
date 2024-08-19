document.addEventListener('DOMContentLoaded', () => {
    const generateReportButton = document.getElementById('generateReport');
    const reportContainer = document.getElementById('reportContainer');
    const reportChartCtx = document.getElementById('reportChart').getContext('2d');
    const chartTypeSelector = document.getElementById('chartType');

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
    
            const data = await response.json();
            console.log("Resposta da API:", data);
    
            if (!Array.isArray(data) || data.length === 0) {
                showAlert('Nenhum dado encontrado para o período selecionado.');
                return;
            }
    
            // Organizar os dados para o gráfico
            const groupedData = data.reduce((acc, visitor) => {
                const date = new Date(visitor.data_entrada).toLocaleDateString();
                if (!acc[date]) acc[date] = 0;
                acc[date]++;
                return acc;
            }, {});

            const labels = Object.keys(groupedData).sort((a, b) => new Date(a) - new Date(b));
            const dataSet = labels.map(label => groupedData[label]);

            // Gerar o gráfico com base no tipo selecionado
            new Chart(reportChartCtx, {
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
});
