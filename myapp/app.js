var express = require('express');
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var expressvalidator = require('express-validator');
const session = require('express-session');

var app = express();
//var server = require('http').createServer(app);
var io = require('socket.io')(3001);

var rotasAdmin = require('./routes/rotasAdmin');
var rotasLoja = require('./routes/rotasLoja');


//SOCKET
let messages = []

io.on('connection', (socket) => {
    console.log(`Socket Conectado: ${socket.id}`);

    socket.on('sendMessage', data => {
        messages.push(data);
        socket.broadcast.emit('receivedMessage', data);
    })
})

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(session({
    secret: 'FelipeZettaByte',
    resave: false,
    saveUninitialized: false
  }))

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, '/')));
app.use(expressvalidator());

app.use(session({
    secret: 'ZetTaBytEInFo',
    resave: false,
    saveUninitialized: false
  }))




// rotas da aplicação
app.use('/', rotasLoja);
app.use('/admin', rotasAdmin);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});



module.exports = app;
