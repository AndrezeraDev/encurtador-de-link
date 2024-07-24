// Função para buscar e exibir o histórico de URLs encurtadas
async function fetchHistory() {
    const resultDiv = document.getElementById('result');

    try {
        const response = await fetch('/history');

        if (response.ok) {
            const data = await response.json();

            let html = '<h2>Histórico de URLs Encurtadas</h2>';
            html += '<table><tr><th>ID</th><th>Long URL</th><th>Short ID</th><th>Criado em</th></tr>';

            data.forEach(url => {
                html += `<tr>
                    <td>${url.id}</td>
                    <td>${url.long_url}</td>
                    <td>${url.short_id}</td>
                    <td>${url.created_at}</td>
                </tr>`;
            });

            html += '</table>';
            resultDiv.innerHTML = html;
        } else {
            resultDiv.textContent = `Erro ao buscar histórico: ${response.status} ${response.statusText}`;
        }
    } catch (error) {
        console.error('Erro:', error);
        resultDiv.textContent = 'Erro ao buscar histórico. Verifique o console para mais detalhes.';
    }
}