const path = require('path');
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const api = require('./routes/api');


const app = express();

app.use(cors({
    origin: 'http://localhost:3000'
})); // cors() is a function that returns a cors middleware

app.use(morgan('combined'));


app.use(express.json());
app.use(express.static(path.join(__dirname,'..','public')));
//app.use on the router exported from the api module
app.use('/v1',api);

app.get('/*',(req,res)=>{
    res.sendFile(path.join(__dirname,'..','public','index.html'));
});
module.exports = app;