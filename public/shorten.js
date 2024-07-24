document.getElementById('shorten-btn').addEventListener('click', async () => {
    const urlInput = document.getElementById('url').value;
    const resultDiv = document.getElementById('result');
    const utmParams = '?utm_source=website&utm_medium=shortener&utm_campaign=link';
    const longUrlWithUtm = urlInput + utmParams;

    try {
        const response = await fetch('/shorten', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ url: longUrlWithUtm })
        });

        if (response.ok) {
            const data = await response.json();
            resultDiv.innerHTML = `URL encurtada: <a href="${data.shortUrl}" target="_blank">${data.shortUrl}</a>`;
        } else {
            resultDiv.textContent = 'Erro ao encurtar a URL. Verifique o console para mais detalhes.';
        }
    } catch (error) {
        console.error('Erro:', error);
        resultDiv.textContent = 'Erro ao encurtar a URL. Verifique o console para mais detalhes.';
    }
});
