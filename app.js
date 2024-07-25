import express from 'express';
import bodyParser from 'body-parser';
import mysql from 'mysql2/promise';
import { nanoid } from 'nanoid';
import cors from 'cors';

const app = express();
const port = 3001;
const baseUrl = 'http://localhost:3001';

// Conexão com o banco de dados
async function initializeDatabase() {
    try {
        const db = await mysql.createConnection({
            host: 'localhost',  // Ou o hostname do banco de dados no cPanel
            user: 'vend3021_url_shortener',  // Atualize com o nome do usuário do banco de dados
            password: 'Vendaseguro001',  // Atualize com a senha do banco de dados
            database: 'url_shortener'  // Atualize com o nome do banco de dados
        });
        console.log('Banco de dados conectado com sucesso');
        return db;
    } catch (err) {
        console.error('Erro ao conectar ao banco de dados:', err);
        process.exit(1); // Encerra o processo se não conseguir conectar ao banco de dados
    }
}

const db = await initializeDatabase();

// Middleware para análise de corpo de solicitação JSON
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

// Servir arquivos estáticos do diretório 'public'
app.use(express.static('public'));

// Endpoint para encurtar a URL
app.post('/shorten', async (req, res) => {
    const longUrl = req.body.url;
    const shortId = nanoid(3);

    try {
        const sql = 'INSERT INTO urls (long_url, short_id) VALUES (?, ?)';
        const [result] = await db.query(sql, [longUrl, shortId]);

        const shortUrl = `${baseUrl}/${shortId}`;
        res.json({ shortUrl });
    } catch (err) {
        console.error('Erro ao encurtar a URL:', err);
        return res.status(500).send('Erro ao encurtar a URL');
    }
});

// Endpoint para redirecionar para URL original
app.get('/:shortId', async (req, res) => {
    const shortId = req.params.shortId;
    const userAgent = req.headers['user-agent'];

    try {
        const sqlSelect = 'SELECT long_url FROM urls WHERE short_id = ?';
        const [result] = await db.query(sqlSelect, [shortId]);

        if (result.length > 0) {
            const longUrl = result[0].long_url;

            const sqlInsertClick = 'INSERT INTO clicks (short_id, user_agent) VALUES (?, ?)';
            await db.query(sqlInsertClick, [shortId, userAgent]);

            res.redirect(longUrl);
        } else {
            res.status(404).send('URL não encontrada');
        }
    } catch (err) {
        console.error('Erro ao redirecionar:', err);
        res.status(500).send('Erro ao redirecionar');
    }
});

// Endpoint para obter histórico de URLs encurtadas
app.get('/history', async (req, res) => {
    try {
        const sql = 'SELECT * FROM urls';
        const [results] = await db.query(sql);
        res.json(results);
    } catch (err) {
        console.error('Erro ao buscar histórico de URLs:', err);
        res.status(500).send('Erro ao buscar histórico de URLs');
    }
});

app.get('/stats', async (req, res) => {
    console.log('Endpoint /stats acessado');  // Log para depuração
    try {
        const sql = `
            SELECT 
                urls.short_id,
                urls.long_url,
                COUNT(clicks.id) AS click_count
            FROM urls
            LEFT JOIN clicks ON urls.short_id = clicks.short_id
            GROUP BY urls.short_id, urls.long_url
        `;
        const [results] = await db.query(sql);
        res.json(results);
    } catch (err) {
        console.error('Erro ao buscar estatísticas de cliques:', err);
        res.status(500).send('Erro ao buscar estatísticas de cliques');
    }
});

// Iniciar o servidor
app.listen(port, () => {
    console.log(`Servidor de encurtamento de URL rodando em http://localhost:${port}`);
});
