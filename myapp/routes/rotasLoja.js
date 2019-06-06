var express = require('express');
var router = express.Router();
const conexaoMDB = require('../config/con_mariaDB');
const crypto = require("crypto");

var connectionMDB = conexaoMDB()

/* GET's. */
router.get('/', function(req, res, next) {
    if ( req.session["usuario"] )
        res.render('./loja_clientes/index',{msg:req.session["usuario"]});
    else        
        res.render('./loja_clientes/index', {msg:""});  
});

router.get('/login', (req, res, next) => {
    if ( req.session["usuario"] )
        res.render('./loja_clientes/login',{msg:req.session["usuario"],erros:{}, dados:{}});
    else        
        res.render('./loja_clientes/login', {msg:"", dados:{}, erros:{}});
})

router.get('/cadastrar_cliente', (req, res, next) => {
    res.render('./loja_clientes/cadastro_clientes', {msg : "", erros:{}, dados:{}});
})

router.get('/recuperar_login_cliente', (req, res, next) => {
    res.render('./loja_clientes/recuperar_login_cliente',{msg:"",erros:{}, dados:{}});
})

router.get('/comparar_produtos', (req, res, next) => {
    if ( req.session["usuario"] )
        res.render('./loja_clientes/comparar_produtos',{msg:req.session["usuario"],erros:{}, dados:{}});
    else
        res.render('./loja_clientes/login',{msg:"",erros:{}, dados:{}});
})

router.get('/carrinho', (req, res, next) => {
    // fazer as tratativas caso o cliente nao estaja logado na página
    if ( req.session["usuario"] )
        res.render('./loja_clientes/carrinho',{msg:req.session["usuario"],erros:{}, dados:{}});
    else
        res.render('./loja_clientes/login',{msg:"",erros:{}, dados:{}});
})

router.get('/logout', (req, res, next)=>{

    req.session.destroy(function(err) {
        console.log("Sessão destruida");
    })

    res.render('./loja_clientes/index', {msg:"", dados:{}, erros:{}})
})


/* POST's */
router.post('/cadastrarCliente', (req, res, next) => {

    console.log(req.body)

    req.assert("nomecompleto", "Nome completo não passou na validação.").notEmpty();
    req.assert("rg", "RG não passou na validação: somente números").isInt().notEmpty();
    req.assert("cpf", "CPF não passou na validação: somente números").isInt().notEmpty();
    req.assert("email", "Email não passou na validação.").isEmail().notEmpty();
    req.assert("endereco", "Endereco não passou na validação.").notEmpty();
    req.assert("cidade", "cidade não passou na validação.").notEmpty();
    req.assert("usuario", "Usuário vazio.").notEmpty();
    req.assert("senha", "senha não passou na validação campo vazio.").notEmpty();
    req.assert("senha", "senha não passou na validação precisa ter o tamanho entre 4 e 8 caracteres.").len(4,8);

    //recebe os erros de validação
    let erros = req.validationErrors();

    if(erros){
        console.log(erros)
        res.render("./loja_clientes/cadastro_clientes", {msg:"Erro de validação:", erros:erros, dados:req.body})
        return
    }


    const sql = "insert into clientes set ?"

    let senhaantiga = req.body.senha;
    //criptografia da senha
    let senha_crypt = crypto.createHash("md5").update(req.body.senha).digest("hex");
    req.body.senha = senha_crypt;
    
    connectionMDB.query(sql, req.body, function(error, result){

        if(!error){
            res.render("./loja_clientes/login", {msg:"Cadastrado com sucesso, agora faça seu login.", dados:{}, erros:{}});
                       
        } else {
            req.body.senha = senhaantiga;
            res.render("./loja_clientes/cadastro_clientes", {msg : "Usuário já cadastrado!", erros:{}, dados:req.body})
            
        }
    })
})

router.post('/recuperarCadastro', (req, res, next) => {

    console.log(req.body)

    req.assert("nomecompleto", "Nome completo não passou na validação.").notEmpty();
    req.assert("rg", "RG não passou na validação: somente números").isInt().notEmpty();
    req.assert("cpf", "CPF não passou na validação: somente números").isInt().notEmpty();
    req.assert("email", "Email não passou na validação.").isEmail().notEmpty();
    req.assert("usuario", "Usuário vazio.").notEmpty();
    req.assert("senha", "senha não passou na validação campo vazio.").notEmpty();
    req.assert("senha", "senha não passou na validação precisa ter o tamanho entre 4 e 8 caracteres.").len(4,8);

    //recebe os erros de validação
    let erros = req.validationErrors();

    if(erros){
        console.log(erros)
        res.render("./loja_clientes/recuperar_login_cliente", {msg:"Erro de validação:", erros:erros, dados:req.body})
        return
    }

    //criptografia da senha
    let senha_crypt = crypto.createHash("md5").update(req.body.senha).digest("hex");
    
    let user = req.body.usuario
    let name = req.body.nomecompleto;
    let rg = req.body.rg;
    let cpf = req.body.cpf;
    let novaSenha = senha_crypt;

    const sql = "SELECT * FROM clientes where usuario='"+user+"'";
    
        connectionMDB.query(sql, function(error, results){

            if(!error && results[0]!=undefined)
            {
                console.log("Não deu erro")

                
                if( name==results[0].nomecompleto && rg==results[0].rg && cpf==results[0].cpf && user==results[0].usuario){

                        console.log("Entrei para atualizar")

                        const sql_atualizar = "UPDATE clientes SET senha= '"+novaSenha+"' where usuario = '"+user+"'";
                      
                        
                        connectionMDB.query(sql_atualizar, function(error, result){
                            if(!error) {
                                res.render("./loja_clientes/login", {msg : "Atualizado com sucesso!"})
                                
                            } else {
                                res.render("./loja_clientes/recuperar_login_cliente", {msg : "Erro ao atualizar senha!", erros:{} ,dados : req.body})
                                
                            }                            
                        })                
                } else {
                    res.render("./loja_clientes/recuperar_login_cliente", {msg : "Os dados não conferem!", erros:{}, dados : req.body})
                                       
                }

            }else{
                
                console.log("Deu ruim no usuario")
                res.render("./loja_clientes/recuperar_login_cliente", {msg : "Usuário não cadastrado no sistema!", erros:{}, dados : req.body})
            }
        })
})


router.post("/validarUsuario", function(req, res, next) {

    console.log(req.body)

    //validação de form
    req.assert("usuario", "Usuário vazio.").notEmpty();
    req.assert("senha", "senha não passou na validação campo vazio.").notEmpty();
    req.assert("senha", "senha não passou na validação precisa ter o tamanho entre 4 e 8 caracteres.").len(4,8);

    //recebe os erros de validação
    let erros = req.validationErrors();

    if(erros){
        console.log(erros)
        res.render("./loja_clientes/login", {msg:"Erro de validação:", erros:erros, dados:req.body})
        return
    }

    //criptografia da senha
    let senha_crypt = crypto.createHash("md5").update(req.body.senha).digest("hex");

    //recuperando dados do form    
    let usuario = req.body.usuario;    
    let senha = senha_crypt;
    
    const sql = "SELECT * FROM clientes where usuario='"+usuario+"' && senha='"+senha+"'";
    
    connectionMDB.query(sql, function(error, results){
        
        if(!error && results[0]!=undefined){

            req.session["usuario"]   = results[0].usuario;
            req.session["clienteID"] = results[0].clienteID;            

            res.render("./loja_clientes/index", {msg:results[0].usuario});

        }else{
            //retornar a pagina com os erros
            res.render("./loja_clientes/login", {msg:"Dados não conferem, tente de novo!", erros:{}, dados:req.body})
        }
    })
})

/* PUT's */


/* DELETE's */

module.exports = router;
