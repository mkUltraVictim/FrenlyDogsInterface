const express = require('express');
const app = express();
const http = require('http');
const Web3 = require('web3');
const bodyParser = require('body-parser');
const { ethers } = require("ethers");
const fs = require("fs");

const httpServer = http.createServer(app);
httpServer.listen(80, () => {
	console.log('HTTP Server running on port 80');
});
app.get('/',async function(req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.sendFile(__dirname + '/client/home/index.html');
});
app.use('/client',express.static(__dirname + '/client'));
app.use(bodyParser.urlencoded({extended: true}));