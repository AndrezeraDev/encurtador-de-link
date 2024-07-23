const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const fetch = require('node-fetch'); // Importe node-fetch para fazer requisições HTTP
const { nanoid } = require('nanoid');

const app = express();
const port = 3000;

// Configuração do MySQL
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'VendaSeguro001',
    database: 'url_shortener'
});

// Conectar ao MySQL
db.connect((err) => {
    if (err) {
        throw err;
    }
    console.log('Conexão ao MySQL estabelecida');
});

// Middleware para análise de corpo de solicitação JSON
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Endpoint para encurtar a URL
app.post('/shorten', async (req, res) => {
    const longUrl = req.body.url;
    const shortId = nanoid(8); // Gera um ID curto de 8 caracteres

    try {
        // Chamar a API do Short.io para criar um link curto
        const response = await fetch('https://api.short.io/links', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer sk_hNBMrG79KttiSXzk' // Substitua com seu API key do Short.io
            },
            body: JSON.stringify({
                originalURL: longUrl
            })
        });

        // Verifique o objeto de resposta da API do Short.io
        console.log(response);

        if (!response.ok) {
            throw new Error('Erro ao encurtar a URL com o Short.io');
        }

        const data = await response.json();

        // Salvar no banco de dados
        const sql = 'INSERT INTO urls (long_url, short_id) VALUES (?, ?)';
        db.query(sql, [longUrl, data.shortURL], (err, result) => {
            if (err) {
                console.error(err);
                return res.status(500).send('Erro ao encurtar a URL');
            }

            res.json({ shortUrl: data.shortURL });
        });
    } catch (err) {
        console.error(err);
        return res.status(500).send('Erro ao encurtar a URL com o Short.io');
    }
});

// Endpoint para redirecionar para URL original
app.get('/:shortId', (req, res) => {
    const shortId = req.params.shortId;

    // Buscar a URL original no banco de dados
    const sql = 'SELECT long_url FROM urls WHERE short_id = ?';
    db.query(sql, [shortId], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Erro ao buscar a URL');
        }

        if (result.length > 0) {
            const longUrl = result[0].long_url;
            res.redirect(longUrl);
        } else {
            res.status(404).send('URL não encontrada');
        }
    });
});

// Iniciar o servidor
app.listen(port, () => {
    console.log(`Servidor de encurtamento de URL rodando em http://localhost:${port}`);
});