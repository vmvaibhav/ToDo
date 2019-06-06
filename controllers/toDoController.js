
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var urlencodedParser = bodyParser.urlencoded({extended: false});

//connect to database
mongoose.connect('mongodb://vmvaibhav:Pa%40123456@todo-shard-00-00-kycnl.mongodb.net:27017,todo-shard-00-01-kycnl.mongodb.net:27017,todo-shard-00-02-kycnl.mongodb.net:27017/test?ssl=true&replicaSet=todo-shard-0&authSource=admin&retryWrites=true&w=majority');


//create a schema
var todoSchema = new mongoose.Schema({
  item: String
});

var Todo = mongoose.model('Todo', todoSchema);
//var data = [{item: 'get milk'}, {item: 'do coding'}, {item: 'have beer'}];

module.exports = function(app){
  app.get('/todo', function(req, res){
    Todo.find({}, function(err, data){
      //get data from the view
      if (err) throw err;
      res.render('todo', {todos: data});
    });
  });

  app.post('/todo',urlencodedParser, function(req, res){
    //get data from the view and add it to the DB
    var newTodo = Todo(req.body).save(function(err, data){
      if(err) throw err;
      res.json(data);
    });
  });

  app.delete('/todo/:item', function(req, res){
    //delete the requested item from mongodb
    Todo.find({item: req.params.item.replace(/\-/g , " ")}).remove(function(err,data){
      if(err) throw err;
      res.json(data);
    });
  });
};
