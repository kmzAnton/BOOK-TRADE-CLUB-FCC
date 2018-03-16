var http = require('http'),
    express = require('express'),
    app = express(),
    server = http.createServer(app),
    io = require('socket.io')(server),
    bodyParser = require('body-parser'),
    cookieParser = require('cookie-parser'),
    passport = require('./auth.js'),
    session = require('express-session'),
    db = require('./db.js');

var routes_main = require('./routes/main.js')(),
    routes_office = require('./routes/office.js')(),
    isAuth = require('./routes/isAuth.js');


app.use(express.static('public'));
app.set('view engine', 'ejs');
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
  secret: 'baikal',
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());



app.get('/', routes_main.all_books);
app.post('/onTrade', routes_main.onTrade);
app.post('/make_new_request', routes_main.make_new_request);

app.get('/office', routes_office.main);
app.get('/test', function(req,res){res.json({test:'fail'})});
app.post('/signup', 
         passport.authenticate('local_signup', {failureRedirect: '/test'}),
         routes_office.main);
app.post('/login', 
         passport.authenticate('local_login', {failureRedirect: '/test'}),
         routes_office.main);
app.get('/add_book', isAuth, routes_office.add_book);
app.get('/logout', routes_office.logout);
app.post('/add_to_lib', routes_office.add_to_lib);
app.post('/edit_user_info', routes_office.edit_user_info);
app.post('/delete_your_request', routes_office.delete_your_request);
app.post('/accept_request', routes_office.accept_request);



io.on('connection', (socket)=>{require('./routes/sockets.js')(io,socket)});


server.listen(process.env.PORT);