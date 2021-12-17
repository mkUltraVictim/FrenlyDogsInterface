let express = require("express")
const app = require("https-localhost")()
const http = require('http');
var https = require('https');
let rateLimit = require('express-rate-limit');
const helmet = require("helmet");
const bodyparser = require("body-parser");

const limiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 200 // limit each IP to 100 requests per windowMs
});
app.listen(443)

//landing page
app.get('/',async function (req, res) {
    res.sendFile(__dirname + '/client/index.html');
});
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use('/client',express.static(__dirname + '/client'));
app.use(limiter);
app.use(helmet({
    contentSecurityPolicy: false
}));
app.use(bodyparser);