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
exports.edit = function(req, res) {
    var collection = db.get().collection('team');

    collection.find({"title": req.params.id}).limit(1).toArray(function(err, results) {
      console.log(results[0]);
        res.render('team/edit', {post: results[0]});
    });
};
exports.form = function (req, res){
  res.render('team/form');
};

exports.update = function (req, res){
  var collection = db.get().collection('team');

  collection.updateOne(
        {title: req.params.id},
        {
            $set: {
              title: req.body.title,
              author: req.body.author,
              category: req.body.category,
              image: req.body.image,
              date: new Date(),
              content: req.body.content
            }
        }
    );

  res.redirect('/team');
};

exports.create = function (req, res){
  var collection = db.get().collection('team');
  collection.insert({
    title: req.body.title,
    author: req.body.author,
    category: req.body.category,
    image: req.body.image,
    date: new Date(),
    content: req.body.content
  }, function (err, doc) {
        if (err) {
            res.send("There was a problem adding the information to the database.");
        }
    });
  res.redirect('/team');
};

exports.remove = function(req, res){
  var collection = db.get().collection('team');

  collection.remove({
    title: req.params.id
  });

  return res.redirect('/team');
};
