// Função para encurtar a URL
async function shortenURL() {
    const urlInput = document.getElementById('url');
    const resultDiv = document.getElementById('result');
    const longUrl = urlInput.value;

    // Adicionando parâmetros UTM à URL longa
    const utmParams = '?utm_source=website&utm_medium=shortener&utm_campaign=link';
    const longUrlWithUtm = longUrl + utmParams;

    try {
        const response = await fetch('/shorten', {  // Requisição para a mesma origem
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ url: longUrlWithUtm }),
        });

        if (response.ok) {
            const data = await response.json();
            resultDiv.innerHTML = `URL encurtada: <a href="${data.shortUrl}" target="_blank">${data.shortUrl}</a>`;
            // Atualizar histórico
            fetchHistory();
        } else {
            resultDiv.textContent = 'Erro ao encurtar a URL. Verifique o console para mais detalhes.';
        }
    } catch (error) {
        console.error('Erro:', error);
        resultDiv.textContent = 'Erro ao encurtar a URL. Verifique o console para mais detalhes.';
    }
}

// Função para buscar e exibir o histórico de URLs encurtadas
async function fetchHistory() {
    const resultDiv = document.getElementById('result');

    try {
        const response = await fetch('/history'); // Requisição para a mesma origem

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

// Função para buscar e exibir as estatísticas de cliques
async function fetchStats() {
    const resultDiv = document.getElementById('stats-result');

    try {
        const response = await fetch('/stats'); // Requisição para a mesma origem

        if (response.ok) {
            const data = await response.json();

            let html = '<h2>Estatísticas de Cliques</h2>';
            html += '<table><tr><th>Short ID</th><th>Long URL</th><th>Quantidade de Cliques</th></tr>';

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

// Adiciona eventos quando o DOM estiver completamente carregado
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('btn').addEventListener('click', shortenURL);
    document.getElementById('history-btn').addEventListener('click', fetchHistory);
    document.getElementById('stats-btn').addEventListener('click', fetchStats);
});
