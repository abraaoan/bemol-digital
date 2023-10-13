const express = require("express");
const dbConfig = require("./config/db.config");
const config = require("./config/config");
const cors = require('cors');
const path = __dirname + '/front-end/dist';

// App
const app = express();
const port = config.PORT;
app.listen(port);

// Cors
app.use(cors({ origin: '*' }));

//
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Database
const mongoose = require("mongoose");
mongoose.connect(dbConfig.uri).catch(error => { console.error(error) });

// 
app.get('/hello', function(_, res) {
  res.json({ message: 'hooray! welcome to Bemol Digital api!' });   
});

// Api router
const apiPath = '/api'
const userRouter = require('./routers/router.user');
app.use(apiPath, userRouter);

// History fallback
var history = require('connect-history-api-fallback');
app.use(history());

// html page
app.use(express.static(path));
app.get('/', function(req, res) {
  res.sendFile(path + "index.html");
});

