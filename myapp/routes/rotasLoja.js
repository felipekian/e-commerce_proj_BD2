var express = require('express');
var router = express.Router();

/* GET's. */
router.get('/', function(req, res, next) {
  res.render('./loja_clientes/index');
});

router.get('/login', (req, res, next) => {
    res.render('./loja_clientes/login');
})

router.get('/cadastrar_cliente', (req, res, next) => {
    res.render('./loja_clientes/cadastro_clientes');
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


/* PUT's */


/* DELETE's */

module.exports = router;
