var express = require('express');
var router = express.Router();
const conexaoMDB = require('../config/con_mariaDB');

var connectionMDB = conexaoMDB()

/* GET's */
router.get('/', function(req, res, next) {
    if(req.session["usuario"])
        res.redirect('/admin/home', {msg:req.session["usuario"]});
    else
        res.render('./loja_admin/index', {msg:""});
});

router.get('/admincadastro', function(req, res, next) {
    res.render('./loja_admin/cadastro', {msg:"", dados:{}});
});

router.get('/adminrecuperar', function(req, res, next) {
    res.render('./loja_admin/recuperar',{msg:"", dados:{}});
});

router.get('/home', function(req, res, next) {
    res.render('./loja_admin/home',{msg:""});
});

router.get('/cadastro_produto', function(req, res, next) {
    res.render('./loja_admin/cadastro_produtos',{msg:""});
});

router.get('/clientes', function(req, res, next) {
    res.render('./loja_admin/clientes',{msg:""});
});

router.get('/chat', function(req, res, next) {
    res.render('./loja_admin/chat_cliente',{msg:""});
});



/* POST's */
router.post("/cadastrarFuncionario", function(req, res, next){

    console.log(req.body)

    const sql = "insert into funcionarios set ?"
    
    connectionMDB.query(sql, req.body, function(error, result){

        if(!error){
            console.log("DEU BOM")
            res.render("./loja_admin/index", {msg:"Cadastrado com sucesso, agora faça seu login."})
                        
        } else {
            console.log("DEU RUIM")
            res.render("./loja_admin/cadastro", {msg : "Funcionário já possui cadastrado!", dados:req.body })
            
        }
    })
})

router.post("/recuperarConta", function(req, res, next){
    console.log(req.body)

    let user = req.body.usuario
    let rg = req.body.rg;
    let cpf = req.body.cpf;
    let novaSenha = req.body.senha;
    
    const sql = "SELECT * FROM funcionarios where usuario='"+user+"'";
    
        connectionMDB.query(sql, function(error, results){

            if(!error && results.length > 0)
            {
                console.log("Não deu erro")

                
                if(rg==results[0].rg && cpf==results[0].cpf && user==results[0].usuario){

                        console.log("Entrei para atualizar")

                        const sql_atualizar = "UPDATE funcionarios SET senha= '"+novaSenha+"' where usuario = '"+user+"'";
                      
                        
                        connectionMDB.query(sql_atualizar, function(error, result){
                            if(!error) {
                                res.render("./loja_admin/index", {msg : "Atualizado com sucesso!"})
                                
                            } else {
                                res.render("./loja_admin/recuperar", {msg : "Erro ao atualizar senha!", dados : req.body})
                                
                            }                            
                        })                
                } else {
                    res.render("./loja_admin/recuperar", {msg : "Os dados não conferem!", dados : req.body})
                }

            }else{
                
                console.log("Deu ruim no usuario")
                res.render("./loja_admin/recuperar", {msg : "Usuário não cadastrado no sistema!", dados : req.body})
            }
        })
})

router.post("/admin/cadastrarProduto", (req, res, next) => {
    console.log(req.body)

    res.send("OK");
})

/* PUT's */


/* DELETE's */


module.exports = router;
