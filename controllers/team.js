var db = require('../config/db');

exports.list = function(req, res){
  var collection = db.get().collection('team');

  collection.find({}).toArray(function(err, results){
    res.render('team/list', {team:results});
  });
};

exports.show = function(req, res) {
    var collection = db.get().collection('team');

    collection.find({"title": req.params.id}).limit(1).toArray(function(err, results) {
      console.log(results[0]);
        res.render('team/show', {post: results[0]});
    });
};
exports.graph = function(req, res) {
    var collection = db.get().collection('team');

    collection.find({"title": req.params.id}).limit(1).toArray(function(err, results) {
      console.log(results[0]);
        res.render('team/graph', {post: results[0]});
    });
};
