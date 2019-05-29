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
    res.render('./loja_clientes/recuperar_login_cliente',{msg:"", dados : {}});
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

            if(!error){
                res.render("./loja_clientes/login", {msg:"Cadastrado com sucesso, agora faça seu login."})
                return            
            } else {
                res.render("./loja_clientes/cadastro_clientes", {msg : "Usuário já possui cadastrado!"})
                return
            }
        })
})

router.post('/recuperarCadastro', (req, res, next) => {

    console.log(req.body)
    
    let user = req.body.usuario
    let name = req.body.nomecompleto;
    let rg = req.body.rg;
    let cpf = req.body.cpf;
    let novaSenha = req.body.senha;

    
    const sql = "SELECT * FROM clientes where usuario='"+user+"'";
    
        connectionMDB.query(sql, function(error, results){

            if(!error && results.length > 0)
            {
                console.log("Não deu erro")

                
                if( name==results[0].nomecompleto && rg==results[0].rg && cpf==results[0].cpf && user==results[0].usuario){

                        console.log("Entrei para atualizar")

                        const sql_atualizar = "UPDATE clientes SET senha= '"+novaSenha+"' where usuario = '"+user+"'";
                      
                        
                        connectionMDB.query(sql_atualizar, function(error, result){
                            if(!error) {
                                res.render("./loja_clientes/login", {msg : "Atualizado com sucesso!"})
                                
                            } else {
                                res.render("./loja_clientes/recuperar_login_cliente", {msg : "Erro ao atualizar senha!", dados : req.body})
                                
                            }                            
                        })                
                } else {
                    res.render("./loja_clientes/recuperar_login_cliente", {msg : "Os dados não conferem!", dados : req.body})
                                       
                }

            }else{
                
                console.log("Deu ruim no usuario")
                res.render("./loja_clientes/recuperar_login_cliente", {msg : "Usuário não cadastrado no sistema!", dados : req.body})
            }
        })
})


/* PUT's */


/* DELETE's */

module.exports = router;
