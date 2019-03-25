var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var mongo = require('mongoose');
var mongooseHidden = require('mongoose-hidden')({ hidden: { _id: true, __v: true } });
const uri = `mongodb://localhost:27017/POSTS_M`;
var db = mongo.connect(uri, function(err, response){
  if (err) {console.log(err);}
  else { console.log('Connected to mongoose [POSTS_M]')};
});

var app = express();
app.use(bodyParser());
app.use(bodyParser.json({limit: '5mb'}));
app.use(bodyParser.urlencoded({extended: true}));

app.use(function(req, res, next){
  res.setHeader('Access-Control-Allow-Origin','http://localhost:4200');
  res.setHeader('Access-Control-Allow-Methods','GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers','X-Requested-With,content-type');
  res.setHeader('Access-Control-Allow-Credentials',true);
  next();
})

var Schema = mongo.Schema;
var PostsSchema = new Schema({
  title: {type: String},
  content:  {type: String}
}, {_id: false});
PostsSchema.plugin(mongooseHidden);
var model = mongo.model('posts', PostsSchema, 'posts');

function errHandler(res, _E){
  console.log(_E);
  res.send(_E.message);
}


app.get('/api/getpost', function(req, res) {
  try{
    model.find({}, function(err, data) {
      if (err) res.send(err);
      res.send(data);
    })
  }catch(_E){
    errHandler(res, _E);
  }

})

app.post('/api/addpost', function(req, res){
  try{
    model.findOneAndUpdate({title: req.body.title}, {$set:{content:req.body.content}}, { upsert: true, new: true, setDefaultsOnInsert: true }, (err, doc) => {
      if (err) { errHandler(res, _E); }
      res.send('Post Updated!!!');
    });
  }catch(_E){
    errHandler(res, _E);
  }
})

app.delete('/api/deletepost', function(req, res) {
  try{
    model.findOneAndDelete({title: req.body.title}, (err, doc) => {
      if (err) { errHandler(res, _E); }
      res.send('Post Deleted!!!');
    });
  }catch(_E){
    errHandler(res, _E);
  }
})

app.listen(3000, function() {
  console.log('App listening on 3000');
})
