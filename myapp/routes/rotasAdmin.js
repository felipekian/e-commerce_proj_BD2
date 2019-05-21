var express = require('express');
var router = express.Router();

/* GET's */
router.get('/', function(req, res, next) {
  res.render('./loja_admin/index');
});

router.get('/admincadastro', function(req, res, next) {
    res.render('./loja_admin/cadastro');
});

router.get('/adminrecuperar', function(req, res, next) {
    res.render('./loja_admin/recuperar');
});

router.get('/home', function(req, res, next) {
    res.render('./loja_admin/home');
});

router.get('/cadastro_produto', function(req, res, next) {
    res.render('./loja_admin/cadastro_produtos');
});

router.get('/clientes', function(req, res, next) {
    res.render('./loja_admin/clientes');
});

router.get('/chat', function(req, res, next) {
    res.render('./loja_admin/chat_cliente');
});



/* POST's */


/* PUT's */


/* DELETE's */


module.exports = router;
