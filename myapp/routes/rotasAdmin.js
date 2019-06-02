var express = require('express');
var router = express.Router();
const conexaoMDB = require('../config/con_mariaDB');
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";
const crypto = require("crypto");
const path = require('path');

var connectionMDB = conexaoMDB();

const multer = require('multer');
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});
const upload = multer({ storage });


/* GET's */
router.get('/', function(req, res, next) {
    if(req.session["usuario"])
        res.render('./loja_admin/home', {msg:req.session["usuario"]});
    else
        res.render('./loja_admin/index', {msg:"", erros:{}, dados:{}});
});

router.get('/admincadastro', function(req, res, next) {    
    res.render('./loja_admin/cadastro', {msg:req.session["usuario"],dados:{},erros:{}});    
});

router.get('/adminrecuperar', function(req, res, next) {    
    res.render('./loja_admin/recuperar',{msg:req.session["usuario"],dados:{},erros:{}});    
});

router.get('/home', function(req, res, next) {
    if(req.session["usuario"])
        res.render('./loja_admin/home',{msg:req.session["usuario"]});
    else
        res.render('./loja_admin/index', {msg:"", erros:{}, dados:{}});
});

router.get('/cadastro_produto', function(req, res, next) {
    if(req.session["usuario"])
        res.render('./loja_admin/cadastro_produtos',{msg:req.session["usuario"],erros:{},dados:{}});
    else
        res.render('./loja_admin/index', {msg:"", erros:{}, dados:{}});
});

router.get('/clientes', function(req, res, next) {
    if(req.session["usuario"])
    {
        console.log("\n\nENTREI\n\n")
        //recuperar os dados do banco
        let sql = "SELECT * FROM clientes LIMIT 100";

        connectionMDB.query(sql, function(error, result){
            console.log("\n\nERRORS: "+ error)
            if(!error && result[0] != undefined)
            {
                console.log("\n\nDEU BOM LISTAR")
                res.render('./loja_admin/clientes',{msg:req.session["usuario"],erros:{},dados:result});
                return
            } 
            else 
            {
                console.log("\n\nDEU RUIM LISTAR")
                res.render('./loja_admin/clientes',{msg:req.session["usuario"],erros:{},dados:{}});
                return
            }
        })
    }
    else
    {
        console.log("SESSAO NAO CRIADA")
        res.render('./loja_admin/index', {msg:"", erros:{}, dados:{}});
    }
    });


router.get('/chat', function(req, res, next) {
    if(req.session["usuario"])
        res.render('./loja_admin/chat_cliente',{msg:req.session["usuario"],erros:{},dados:{}});
    else
        res.render('./loja_admin/index', {msg:"", erros:{}, dados:{}});
    
});

router.get('/logout', (req, res, next)=>{

    req.session.destroy(function(err) {
        console.log("Sessão destruida");
    })

    res.render('./loja_admin/index', {msg:"", dados:{}, erros:{}})
})


/* POST's */
router.post("/cadastrarFuncionario", function(req, res, next){
    
    console.log(req.body)

    req.assert("nomecompleto", "Nome completo não passou na validação.").notEmpty();
    req.assert("rg", "RG não passou na validação: somente números").isInt().notEmpty();
    req.assert("cpf", "CPF não passou na validação: somente números").isInt().notEmpty();
    req.assert("email", "Email não passou na validação.").isEmail().notEmpty();
    req.assert("telefone", "telefone não passou na validação.").notEmpty().isInt();
    req.assert("usuario", "Usuário vazio.").notEmpty();
    req.assert("senha", "senha não passou na validação campo vazio.").notEmpty();
    req.assert("senha", "senha não passou na validação precisa ter o tamanho entre 4 e 8 caracteres.").len(4,8);

    //recebe os erros de validação
    let erros = req.validationErrors();

    if(erros){
        console.log(erros)
        res.render("./loja_admin/cadastro", {msg:"Erro de validação:", erros:erros, dados:req.body})
        return
    }

    const sql = "insert into funcionarios set ?"

    const senhaAntiga = req.body.senha;

    //criptografia da senha
    let senha_crypt = crypto.createHash("md5").update(req.body.senha).digest("hex");
    req.body.senha = senha_crypt;

    connectionMDB.query(sql, req.body, function(error, result){
        if(!error){
            console.log("DEU BOM")
            res.render("./loja_admin/index", {msg:"Cadastrado com sucesso!", erros:{}, dados:{}})
                        
        } else {
            req.body.senha = senhaAntiga;
            console.log("DEU RUIM")
            res.render("./loja_admin/cadastro", {msg : "Funcionário já cadastrado!", dados:req.body, erros:{}})            
        }
    })
})

router.post("/recuperarConta", function(req, res, next){
    console.log(req.body)
    
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
        res.render("./loja_admin/recuperar", {msg:"Erro de validação:", erros:erros, dados:req.body})
        return
    }

    let user = req.body.usuario
    let rg = req.body.rg;
    let cpf = req.body.cpf;
    const senhaAntiga = req.body.senha;

    //criptografia da senha
    let novaSenha = crypto.createHash("md5").update(req.body.senha).digest("hex");
    req.body.senha = novaSenha;    
    
    const sql = "SELECT * FROM funcionarios where usuario='"+user+"'";
    
        connectionMDB.query(sql, function(error, results){

            if(!error && results.length > 0)
            {
                console.log("deu bom")
                
                if(rg==results[0].rg && cpf==results[0].cpf && user==results[0].usuario){

                        console.log("Entrei para atualizar")

                        const sql_atualizar = "UPDATE funcionarios SET senha= '"+novaSenha+"' where usuario = '"+user+"'";                      
                        
                        connectionMDB.query(sql_atualizar, function(error, result){
                            if(!error) {
                                res.render("./loja_admin/index", {msg : "Atualizado com sucesso!", erros:{}, dados:{}})
                                return
                            } else {
                                res.render("./loja_admin/recuperar", {msg : "Erro ao atualizar senha!", dados:req.body, erros:{}})
                                return
                            }                            
                        })                
                } else {
                    res.render("./loja_admin/recuperar", {msg : "Os dados não conferem!", dados:req.body, erros:{}})
                    return
                }

            }else{                
                console.log("Deu ruim no usuario")
                res.render("./loja_admin/recuperar", {msg : "Usuário não cadastrado no sistema!", dados:req.body, erros:{}})
                return
            }
        })
})

router.post('/validarLogin', (req, res, next) => {

    console.log(req.body)

    req.assert("usuario", "Usuário vazio.").notEmpty();
    req.assert("senha", "senha não passou na validação campo vazio.").notEmpty();
    req.assert("senha", "senha não passou na validação precisa ter o tamanho entre 4 e 8 caracteres.").len(4,8);

    //recebe os erros de validação
    let erros = req.validationErrors();

    if(erros){
        console.log(erros)
        res.render("./loja_admin/index", {msg:"Erro de validação:", erros:erros, dados:req.body})
        return
    }

    let user = req.body.usuario
    const senhaAntiga = req.body.senha;

    //criptografia da senha
    let novaSenha = crypto.createHash("md5").update(req.body.senha).digest("hex");
    req.body.senha = novaSenha;    
    
    const sql = "SELECT * FROM funcionarios where usuario='"+user+"' && senha='"+novaSenha+"'";
        
    connectionMDB.query(sql, function(error, results){

        if(!error && results[0] != undefined)
        {   
            console.log("criando sessao")

            req.session["usuario"]   = results[0].usuario;
            req.session["funcionarioID"] = results[0].funcionarioID;

            console.log("Deu muito BOM")
            res.render("./loja_admin/home", {msg:results[0].usuario})
            return
        }
        else
        {
            console.log("Deu muito ruim")
            req.body.senha = senhaAntiga;
            res.render("./loja_admin/index", {msg:"Dados não conferem!", dados:req.body, erros:{}})
            return
        }
    })

})

router.post('/cadastrarProduto',upload.single('file'), (req, res, next) => {
    
    // validar formulário
    req.assert("nomeproduto", "Nome do produto precisa ser informado.").notEmpty();
    req.assert("preco", "Preço precisa ser numérico").isInt();
    req.assert("preco", "Preço não pode ser vazio").notEmpty();
    req.assert("descricao", "Descrição precisa ser informada").notEmpty();
        
    let erros = req.validationErrors();

    if(erros){
        console.log(erros)
        res.render("./loja_admin/cadastro_produtos", {msg:"Erro de validação:", erros:erros, dados:req.body})
        return
    }
    
    //recuperando o path da imagem para colocar no req.body para ser cadastrado
    const localImg = req.file.path;
    req.body.img = localImg;

    console.log(req.body)

    //cadastrar no banco
    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("zettaByte");        
        dbo.collection("produtos").insert(req.body, function(err, result) {
            if (!err) {            
                res.render("./loja_admin/cadastro_produtos", {msg:"Cadastrado com sucesso!", dados:{}, erros:{}})
                db.close();
                return
            } 
            else {
                res.render("./loja_admin/cadastro_produtos", {msg:"Falha ao cadastrar!", dados:req.body, erros:{}})
            }
        });
    });
})

/* PUT's */


/* DELETE's */


module.exports = router;
