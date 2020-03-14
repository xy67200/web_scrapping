const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require('mongoose');
const router = express.Router();
const bodyParser = require('body-parser');

const db = require('./database/db');

app.use(express.json());
// app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

const newsRouter = require('./routes/news');
app.use(newsRouter);

app.use((req,res,next) => {
    req.header('Access-Control-Allow-Origin', '*');
    req.header('Access-Control-Allow-Method', 'GET,POST,HEAD,OPTIONS,DELETE,PUT');
    req.header('Access-Control-Allow-Headers', 'Origin, X-Requested-with,Content-type,Accept');
    next();
});
app.listen(3000, () => console.log('server started on port 3000'));
