document.addEventListener('DOMContentLoaded', () => {
    const generateReportButton = document.getElementById('generateReport');
    const reportContainer = document.getElementById('reportContainer');
    const reportChartCtx = document.getElementById('reportChart').getContext('2d');

    generateReportButton.addEventListener('click', async () => {
        const startDate = document.getElementById('startDate').value;
        const endDate = document.getElementById('endDate').value;
    
        if (!startDate || !endDate) {
            alert('Por favor, selecione ambas as datas.');
            return;
        }
    
        try {
            const token = localStorage.getItem('token'); 
    
            if (!token) {
                alert('Token não encontrado. Por favor, faça login novamente.');
                return;
            }
    
            const response = await fetch(`/api/visitors/report?start=${startDate}&end=${endDate}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
    
            const data = await response.json();
            console.log("Resposta da API:", data);  // Verifique o que a API está retornando
    
            if (!Array.isArray(data)) {
                throw new TypeError('Os dados recebidos não são um array.');
            }
    
            if (data.length === 0) {
                alert('Nenhum dado encontrado para o período selecionado.');
                return;
            }
    
            // Processar os dados para o gráfico
            const labels = data.map(visitor => visitor.data_entrada);
            const dataSet = data.map(visitor => visitor.nome.length);
    
            // Gerar o gráfico
            new Chart(reportChartCtx, {
                type: 'bar',
                data: {
                    labels: labels,
                    datasets: [{
                        label: 'Visitantes por Data',
                        data: dataSet,
                        backgroundColor: 'rgba(75, 192, 192, 0.2)',
                        borderColor: 'rgba(75, 192, 192, 1)',
                        borderWidth: 1
                    }]
                },
                options: {
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    }
                }
            });
    
            reportContainer.style.display = 'block';
        } catch (error) {
            console.error('Erro ao gerar relatório:', error);
            alert('Erro ao gerar relatório. Tente novamente.');
        }
    });    
});
