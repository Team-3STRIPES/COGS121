var http = require('http'),
    express = require('express'),
    path = require('path'),
    bodyParser = require('body-parser');

const PORT = 1500

var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static(__dirname+'/static_files/html'));
app.use(express.static(__dirname+'/static_files/css'));
app.use(express.static(__dirname+'/static_files/js'));
app.use(express.static(__dirname+'/static_files/media'));

app.get('/', function(req, res){
  res.sendFile(path.join(__dirname, '/static_files/html/home.html'));
})

app.get('/home', function(req, res){
  res.sendFile(path.join(__dirname, '/static_files/html/home.html'));
})

app.get('/profile', function(req, res){
  res.sendFile(path.join(__dirname, '/static_files/html/study.html'));
})

app.get('/test', function(req, res){
  res.sendFile(path.join(__dirname, '/static_files/html/test.html'));
})

app.get('/def', function(req, res) {
<<<<<<< HEAD
  console.log("def got pinged")
  let spawn = require("child_process").spawn;
  let child = spawn('py',["python_scripts/word_to_def.py", req.query.def]);

  child.stdout.on('data', (data)=>{
    console.log('on data')
  	res.send({'def': data.toString('utf8')});
  });
})

app.get('/slang', function(req,res) {
  console.log("slang got pinged")
  let spawn = require("child_process").spawn;
  let child = spawn('py',["python_scripts/detect_slang.py", req.query.def]);

  child.stdout.on('data', (data)=>{
      console.log('detected slang')
      console.log(data.toString('utf8'))
      res.send({'words': data.toString('utf8')});
  });
})

app.post('/hist', function(req,res) {
  console.log("hist got pinged")
  console.log(req.body.def);
=======
	  let spawn = require("child_process").spawn;
    let child = spawn('python',["python_scripts/word_to_def.py", req.query.def]);

    child.stdout.on('data', (data)=>{
      console.log('on data')
    	res.send({'def': data.toString('utf8')});
    });
>>>>>>> 382b2bb8564b6c366739f55e50527845591be649
})




app.listen(PORT, () => console.log(`Listening on ${ PORT }`))
