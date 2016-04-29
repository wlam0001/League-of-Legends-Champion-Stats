var express = require('express');
var bodyParser = require('body-parser');
var app = express();

var db = require('./config/db');
var team = require('./controllers/team');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(express.static('public'));

app.set('view engine', 'ejs');

app.get('/home', team.list);
app.get('/show', team.show);
app.get('/graph', team.graph);


db.connect('mongodb://localhost:27017/finalcontents', function(){
  console.log('MongoDB started...');
  app.listen(3000,function(){
    console.log("Express started");
  });
});
