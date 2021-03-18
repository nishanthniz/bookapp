let path = require("path")
let express = require("express");
let bodyParser = require("body-parser");
let cookieParser = require("cookie-parser");
require('dotenv').config();
let app = express();

// Routes
let bookOperations = require('./routes/bookOperations');
let userOperations = require('./routes/userRegisteration');
let userLogin = require('./routes/userLogin');
let port = process.env.PORT || 3000;
// View Engine
app.set('views', path.join(__dirname, "views"));
app.set('view engine', 'jade');
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json({
    limit: '10mb'
}));
app.use(express.json());
app.use(express.urlencoded({
    extended: false
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/bookOperations', bookOperations);
app.use('/userRegisteration', userOperations);
app.use('/userLogin', userLogin);

app.listen(port, () => {
    console.log("Server listening on 3000");
});