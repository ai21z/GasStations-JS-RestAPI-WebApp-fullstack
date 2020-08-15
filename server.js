var express = require('express');
var path = require('path')
var session = require('express-session');
var FileStore = require('session-file-store')(session);
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');;
const dotenv = require('dotenv');
var morgan = require('morgan');
var bcrypt = require('bcryptjs');
var mysql = require('mysql');
var path = __dirname + '/views/';
var app = express();

var PORT = process.env.PORT || 3000;
dotenv.config({ path: './config/config.env'});

var passport = require('passport');
var flash = require('connect-flash');

require('./config/passport')(passport);


app.use(morgan('dev'));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');
app.use(express.static("public"));

//ΑΠΟΘΗΚΕΥΣΗ SESSION
app.use(session({
   store : new FileStore({path : './sessions/'}),  
   secret: 'justasecret',
   resave: true,
   saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

require('./app/routes.js')(app, passport);



app.listen(PORT, () => console.log(`Listening on port ${PORT}`));