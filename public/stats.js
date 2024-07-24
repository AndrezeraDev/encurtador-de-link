async function fetchStats() {
    const resultDiv = document.getElementById('stats-result');

    try {
        const response = await fetch('/stats');

        if (response.ok) {
            const data = await response.json();
            let html = '<table><tr><th>Short ID</th><th>Long URL</th><th>Quantidade de Cliques</th></tr>';
            data.forEach(stat => {
                html += `<tr>
                    <td>${stat.short_id}</td>
                    <td>${stat.long_url}</td>
                    <td>${stat.click_count}</td>
                </tr>`;
            });
            html += '</table>';
            resultDiv.innerHTML = html;
        } else {
            resultDiv.textContent = `Erro ao buscar estatísticas: ${response.status} ${response.statusText}`;
        }
    } catch (error) {
        console.error('Erro:', error);
        resultDiv.textContent = 'Erro ao buscar estatísticas. Verifique o console para mais detalhes.';
    }
}

document.addEventListener('DOMContentLoaded', fetchStats);
