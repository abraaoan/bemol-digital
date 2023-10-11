const express = require("express");
const dbConfig = require("./config/db.config");
const config = require("./config/config");
const cors = require('cors');

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

// Router
const router = express.Router();

router.use(function(_, _, next) {
  next();
});

app.get('/', function(_, res) {
  res.json({ message: 'hooray! welcome to Bemol Digital api!' });   
});

const path = '/api'
const userRouter = require('./routers/router.user');
app.use(path, userRouter);
