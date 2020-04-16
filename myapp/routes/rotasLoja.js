var express = require('express');
var router = express.Router();
const conexaoMDB = require('../config/con_mariaDB');
const crypto = require("crypto");
var MongoClient = require('mongodb').MongoClient;
var mongo = require('mongodb');
var url = "mongodb://localhost:27017/";

var connectionMDB = conexaoMDB()

/* GET's. */
router.get('/', function(req, res, next) {

    var produt = {};
    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("zettaByte");
        dbo.collection("produtos").find({}).toArray(function(err, result) {
            if (err) throw err;
            
            if ( req.session["usuario"] )
            {
                res.render('./loja_clientes/index',{msg:req.session["usuario"], produtos:produt, sinal:0});
            }
            else
            {
                res.render('./loja_clientes/index', {msg:"", produtos:result, sinal:0});
            }
            db.close();
        });
    });
});

router.get('/login', (req, res, next) => {
    if ( req.session["usuario"] )
        res.render('./loja_clientes/login',{msg:req.session["usuario"],erros:{}, dados:{}});
    else
        res.render('./loja_clientes/login', {msg:"", dados:{}, erros:{}});
})

router.get('/chat', (req, res, next) => {
    if ( req.session["usuario"] )
        res.render('./loja_clientes/chat',{msg:req.session["usuario"],erros:{}, dados:{}});
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
    {
        MongoClient.connect(url, function(err, db) {
            if (err) throw err;
            var dbo = db.db("zettaByte");
            dbo.collection("produtos").find({}).sort({tipo:1}).toArray(function(err, result) {
                if (err) throw err;
                
                res.render('./loja_clientes/comparar_produtos',{msg:req.session["usuario"],erros:{}, dados:result , dadosum:{}, dadosdois:{}, selecionados:{}});

                console.log(result);
                db.close();
            });
        });
    }
    else
        res.render('./loja_clientes/login',{msg:"",erros:{}, dados:{}});
})

router.get('/carrinho', (req, res, next) => {
    // fazer as tratativas caso o cliente nao estaja logado na página
    if ( req.session["usuario"] )
    {
        var id_cliente = req.session["clienteID"];
        var dados_produto = {};


        MongoClient.connect(url, function(err, db) {
            if (err) throw err;
            var dbo = db.db("zettaByte");

            //faz a busca nos produtos salvos no carrinho de compra

            dbo.collection("carrinho").find({ "cliente_id" : id_cliente }, {_id:0, produto_id:1, cliente_id:0}).toArray(function(err, result) {
                if (err) throw err;

                //erro para inserir no ids
                ids = []

                result.forEach(element => {
                    ids.push( new mongo.ObjectID(element.produto_id) )
                });

                //retornando os produtos salva no carrinho pelo cliente, faz-se uma consulta para retornar os produtos para listagem no carrinho.
                dbo.collection("produtos").find({ "_id" : { $in : ids } }).toArray(function(err, resultado) {
                    if (err) throw err;
                    
                    res.render('./loja_clientes/carrinho',{msg:req.session["usuario"],erros:{}, dados:resultado});
    
                    console.log(resultado);
                    db.close();
                });
            });
        });
    }
    else
        res.render('./loja_clientes/login',{msg:"",erros:{}, dados:{}});
})


router.get('/minhascompras', (req, res, next) => {
    if ( req.session["usuario"] )
    {
        MongoClient.connect(url, function(err, db) {
            if (err) throw err;
            var dbo = db.db("zettaByte");

            var myquery = { "clienteID" : req.session["clienteID"] };

            dbo.collection("compras").find(myquery).toArray(function(err, result) {
              if (err) throw err;
              
              console.log("\n\nPRODUTOS COMPRADOS: ")
              console.log(result)

              res.render('./loja_clientes/minhascompras',{msg:req.session["usuario"],erros:{}, produtos:result});

              
              db.close();
            });
        });
    }else
        res.render('./loja_clientes/login', {msg:"", dados:{}, erros:{}});
})

router.get('/minhascompras/:id', (req, res, next) => {
    if ( req.session["usuario"] )
    {
        
        var id = new mongo.ObjectID(req.params.id);

        MongoClient.connect(url, function(err, db) {
            if (err) throw err;
            var dbo = db.db("zettaByte");

            var myquery = { "_id" : id };

            dbo.collection("compras").find(myquery).toArray(function(err, result) {
              if (err) throw err;
              
              console.log("\n\nPRODUTOS DETALHES COMPRA: ")
              console.log(result)

              res.render('./loja_clientes/minhacompradetalhe',{msg:req.session["usuario"],erros:{}, produtos:result});

              
              db.close();
            });
        });
    }else
        res.render('./loja_clientes/login', {msg:"", dados:{}, erros:{}});
})


router.get('/excluirProdutoCarrinho/:id', function(req, res, next) {

    if( req.session["usuario"] ) {

        var produto_id = req.params.id;
        var id_cliente = req.session["clienteID"];

        console.log("\n\nPRODUTO_ID: "+ produto_id);


        MongoClient.connect(url, function(err, db) {
            if (err) throw err;
            var dbo = db.db("zettaByte");

            var myquery = { $and: [{produto_id:produto_id},{cliente_id:id_cliente}] };

            dbo.collection("carrinho").deleteOne(myquery, function(err, obj) {
              if (err) throw err;
              console.log("1 document deleted");
              res.redirect('/carrinho');
              db.close();
            });
        });
        
    }else {
        res.render('./loja_clientes/login',{msg:"",erros:{}, dados:{}});
    }

})


router.get('/logout', (req, res, next)=>{

    req.session.destroy(function(err) {
        console.log("Sessão destruida");
    })

    res.redirect('/')
})



router.get('/produto/:id', function(req, res, next) {
    console.log(req.params.id);

    if( req.session["usuario"] ) {
        MongoClient.connect(url, function(err, db) {
            if (err) throw err;
            var dbo = db.db("zettaByte");
            dbo.collection("produtos").find({ "tipo" : req.params.id }).sort({preco:1}).toArray(function(err, result) {
                if (err) throw err;
                
                res.render('./loja_clientes/index',{msg:req.session["usuario"], produtos:result, sinal:1});

                console.log(result);
                db.close();
            });
        });
    
    } 
    else {
        res.render('./loja_clientes/login',{msg:"",erros:{}, dados:{}});
    }
});


router.get('/salvarcarrinho/:id', function(req, res, next) {
    if ( req.session["usuario"] ){
        
        var id = req.params.id;
        var id_cliente = req.session["clienteID"];

        inserir = {
            "produto_id" : id,
            "cliente_id" : id_cliente
        }
        
        MongoClient.connect(url, function(err, db) {
            if (err) throw err;
            var dbo = db.db("zettaByte");
            dbo.collection("carrinho").insert( inserir , function(err, result) {                
                res.redirect("/")
                db.close();                    
            });
        });

    } 
    else {
        res.render('./loja_clientes/login',{msg:"",erros:{}, dados:{}});
    }
})
/*
router.get('/detalheproduto/:id', function(req, res, next) {
    if ( req.session["usuario"] ){

        let ID = req.params.id;
        var o_id = new mongo.ObjectID(ID);

        MongoClient.connect(url, function(err, db) {
            if (err) throw err;
                var dbo = db.db("zettaByte");
                dbo.collection("produtos").find({"_id" : o_id}).toArray(function(err, result) {
                    if (err) throw err;
                    
                    res.render('./loja_clientes/detalheproduto',{msg:req.session["usuario"],erros:{},dados:result});
                    
                    console.log(result);

                    db.close();
                });
        });
    } 
    else {
        res.render('./loja_clientes/login',{msg:"",erros:{}, dados:{}});
    }
})
*/

router.get('/detalheproduto/:id', function(req, res, next) {
    if ( req.session["usuario"] ){

        let ID = req.params.id;
        var o_id = new mongo.ObjectID(ID);
        var sugestao = {}
        MongoClient.connect(url, function(err, db) {
            if (err) throw err;
            var dbo = db.db("zettaByte");
            
            dbo.collection("produtos").find({}).toArray(function(err, result) {
                if (err) throw err;
                
                sugestao = result;

                dbo.collection("produtos").find({"_id" : o_id}).toArray(function(err, result) {
                    if (err) throw err;
                    
                    res.render('./loja_clientes/detalheproduto',{msg:req.session["usuario"],erros:{},dados:result, sugestao:sugestao});
                    db.close();
                });
            });
        });
    } 
    else {
        res.render('./loja_clientes/login',{msg:"",erros:{}, dados:{}});
    }
})


/* POST's */

router.post('/registrarCompra', (req, res, next) => {    

    let dados = req.body;
    dados.clienteID = req.session['clienteID'];
    dados.enviado = false;

    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("zettaByte");
        dbo.collection("compras").insert( dados , function(err, result) {
            
            dbo.collection("carrinho").deleteMany( {'cliente_id' : req.session['clienteID']} , function(err, result) {
                if (err) throw err;
            
                res.send('OK')
                db.close();
            });
        });
    });

})


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

            //res.render("./loja_clientes/index", {msg:results[0].usuario});
            
            res.redirect("/");


        }else{
            //retornar a pagina com os erros
            res.render("./loja_clientes/login", {msg:"Dados não conferem, tente de novo!", erros:{}, dados:req.body})
        }
    })
})

router.post('/comparaprodutos', function(req, res, next) {

    console.log(req.body)

    let produtoid1 = req.body.prod1;
    let produtoid2 = req.body.prod2;

    var prod1_id = new mongo.ObjectID(produtoid1);
    var prod2_id = new mongo.ObjectID(produtoid2);

    var resultProd1 = {};
    var resultProd2 = {};
    var todos  = {};

/**
 *  Encadeia as consultas por serem assincronas e com isso não da o erro de ele retornar as informações incompletas.
 */

    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("zettaByte");
        dbo.collection("produtos").find({"_id" : prod1_id}).toArray(function(err, result) {
            if (err) throw err;
            resultProd1 = result;
            
            dbo.collection("produtos").find({"_id" : prod2_id}).toArray(function(err, result) {
                if (err) throw err;
                resultProd2 = result;
                
                dbo.collection("produtos").find({}).sort({tipo:1}).toArray(function(err, result) {
                    if (err) throw err;
                    todos = result;
                    
                    res.render('./loja_clientes/comparar_produtos',{msg:req.session["usuario"],erros:{}, dados:todos , dadosum:resultProd1, dadosdois:resultProd2, selecionados:req.body});
                    db.close();
                });
            });
        });
    });



/*
    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("zettaByte");
        dbo.collection("produtos").find({"_id" : prod1_id}).toArray(function(err, result) {
            if (err) throw err;
            resultProd1 = result;
            //console.log("\n\nPRODUTO1: "+result);
            db.close();
        });
    });
*/
/*
    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("zettaByte");
        dbo.collection("produtos").find({"_id" : prod2_id}).toArray(function(err, result) {
            if (err) throw err;
            resultProd2 = result;
            //console.log("\n\nPRODUTO2: "+result);
            db.close();
        });
    });
*/
/*
    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("zettaByte");
        dbo.collection("produtos").find({}).sort({tipo:1}).toArray(function(err, result) {
            if (err) throw err;            
            todos = result;
            
            res.render('./loja_clientes/comparar_produtos',{msg:req.session["usuario"],erros:{}, dados:todos , dadosum:resultProd1, dadosdois:resultProd2, selecionados:req.body});
            db.close();
        });
    });
*/

    
    //res.render('./loja_clientes/comparar_produtos',{msg:req.session["usuario"],erros:{}, dados:todos , dados1:produtoid1, dados2:produtoid2});
    

})

/* PUT's */


/* DELETE's */

module.exports = router;
