const mongo = require('mongodb');

let conMongoDB = function(){
    console.log('Conectou-se ao banco!')
    let db = new mongo.Db(
        'zettaByte',
        new mongo.server(
            '127.0.0.1', 
            '27017', 
            {}
        ),
        {}
    );
    return db;
}

module.exports = function(){
    return conMongoDB;
}