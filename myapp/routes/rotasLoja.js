var express = require('express');
var router = express.Router();
const conexaoMDB = require('../config/con_mariaDB');

var connectionMDB = conexaoMDB()

/* GET's. */
router.get('/', function(req, res, next) {
  res.render('./loja_clientes/index');
});

router.get('/login', (req, res, next) => {
    res.render('./loja_clientes/login', {msg:""});
})

router.get('/cadastrar_cliente', (req, res, next) => {
    res.render('./loja_clientes/cadastro_clientes', {msg : ""});
})

router.get('/recuperar_login_cliente', (req, res, next) => {
    res.render('./loja_clientes/recuperar_login_cliente');
})

router.get('/comparar_produtos', (req, res, next) => {
    res.render('./loja_clientes/comparar_produtos');
})

router.get('/carrinho', (req, res, next) => {
    // fazer as tratativas caso o cliente nao estaja logado na página
    res.render('./loja_clientes/carrinho');
})


/* POST's */
router.post('/cadastrarCliente', (req, res, next) => {

    console.log(req.body)            
    
    const sql = "insert into clientes set ?"
    
        connectionMDB.query(sql, req.body, function(error, result){

            if(!error)
                res.render("./loja_clientes/login", {msg:"Cadastrado com sucesso, agora faça seu login."})
            else
                res.render("./loja_clientes/cadastro_clientes", {msg : "Usuário já possui cadastrado!"})
        })
})


/* PUT's */


/* DELETE's */

module.exports = router;
