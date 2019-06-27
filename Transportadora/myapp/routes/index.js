var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/:cep', function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
	var cep = req.params.cep;

	var freteExpress = Math.floor(Math.random() * 100);
	var tempoExpress = Math.floor(Math.random() * 6);

	var freteLento   = Math.floor(Math.random() * 100);
	var freteLento   = Math.floor(Math.random() * 30);

	if(freteExpress == 0) {
		freteLento++;
	}

	if(freteLento < 15){
		freteLento = 15;
	}

	var frete = {
		"rapido" : {"valor":freteExpress, "tempo":5},
		"lento"  : {"valor":freteLento, "tempo":30},
	}

	res.json(frete);
});

module.exports = router;
