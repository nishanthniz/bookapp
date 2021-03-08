let path = require("path")
let express = require("express");
let bodyParser = require("body-parser");
let cookieParser = require("cookie-parser");
let app = express();

// Routes
let bookOperations = require('./routes/bookOperations');

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

app.listen(3000, () => {
    console.log("Server listening on 3000");
});