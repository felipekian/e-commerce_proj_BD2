var express = require('express');
var router = express.Router();

/* GET's */
router.get('/', function(req, res, next) {
  res.render('./loja_admin/index', { title: 'Rotas admin' });
});


/* POST's */


/* PUT's */


/* DELETE's */


module.exports = router;
