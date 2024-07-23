const Sequelize = require('sequelize');

const sequelize = new Sequelize('url_shortener', 'root', 'VendaSeguro', {
    host: 'localhost',
    dialect: 'mysql'
});

sequelize.authenticate()
    .then(() => {
        console.log('Conexão ao banco de dados estabelecida com sucesso.');
    })
    .catch(err => {
        console.error('Erro ao conectar ao banco de dados:', err);
    });