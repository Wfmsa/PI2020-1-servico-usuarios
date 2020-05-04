const restify = require('restify');
const errs = require('restify-errors');

const server = restify.createServer({
    name: 'myapp',
    version: '1.0.0'
});

var knex = require('knex')({
    client: 'mysql',
    connection: {
        host: 'fermatil.com.br',
        user: 'fermatil_pi',
        password: 'pi2k20!@#',
        database: 'fermatil_pi2k20'
    }
});

server.use(restify.plugins.acceptParser(server.acceptable));
server.use(restify.plugins.queryParser());
server.use(restify.plugins.bodyParser());

server.listen(8080, function () {
    console.log('%s listening at %s', server.name, server.url);
});

// rotas REST

// rotas passageiros
server.get('/lista/passageiro', (req, res, next) => {

    knex('USERS_PASSAGEIROS').then((dados) => {
        res.send(dados);
    }, next)
});

server.post('/login/passageiro', (req, res, next) => {
    const { nome, passwd } = req.body;

    knex('USERS_PASSAGEIROS')
        .where({
            Nome: nome,
            passwd: passwd
        })
        .then((dados) => {
            if (dados.length > 0)
                res.send(dados);
            else
                res.send(false);
        }, next)
});

server.put('/update/statusPassageiro/:id', (req, res, next) => {

    const { id, status } = req.body;

    knex('USERS_PASSAGEIROS')
        .where('id', id)
        .update('status', status)
        .then((dados) => {
            if (!dados) return res.send(new errs.BadRequestError('nada foi encontrado'))
            res.send('dados atualizados');
        }, next)
});

server.put('/update/dadosPassageiro/:id', (req, res, next) => {

    const { id, Nome, telefone, endereco_rua, endereco_bairro, endereco_num } = req.body;

    knex('USERS_PASSAGEIROS')
        .where('id', id)
        .update({ Nome: Nome, telefone: telefone, endereco_rua: endereco_rua, endereco_bairro: endereco_bairro, endereco_num: endereco_num },
        ['id', 'Nome','telefone','endereco_rua','endereco_bairro','endereco_num'])
        .then((dados) => {
            if (!dados) return res.send(new errs.BadRequestError('nada foi encontrado'))
            res.send('dados atualizados');
        }, next)
});

//rotas motorista
server.post('/login/motorista', (req, res, next) => {
    const { nome, passwd } = req.body;

    knex('USERS_MOTORISTA')
        .where({
            nome: nome,
            passwd: passwd
        })
        .then((dados) => {
            if (dados.length > 0)
                res.send(dados);
            else
                res.send(false);
        }, next)
});

server.post('/cadastro/motorista', (req, res, next) => {

    knex('USERS_MOTORISTA')
        .insert(req.body)
        .then((dados) => {
            res.send(dados);
        }, next)
});

// server.get('/show/:id', (req, res, next) => {

//     const { id } = req.params;

//     knex('rest')
//         .where('id', id)
//         .first()
//         .then((dados) => {
//             if(!dados) return res.send(new errs.BadRequestError('nada foi encontrado'))
//             res.send(dados);
//         }, next)
// });

server.put('/update/motorista/:id', (req, res, next) => {

    const { id } = req.params;

    knex('USERS_MOTORISTA')
        .where('id', id)
        .update(req.body)
        .then((dados) => {
            if (!dados) return res.send(new errs.BadRequestError('nada foi encontrado'))
            res.send('dados atualizados');
        }, next)
});

server.del('/delete/motorista/:id', (req, res, next) => {

    const { id } = req.params;

    knex('USERS_MOTORISTA')
        .where('id', id)
        .delete()
        .then((dados) => {
            if (!dados) return res.send(new errs.BadRequestError('nada foi encontrado'))
            res.send('dados excluidos');
        }, next)
});