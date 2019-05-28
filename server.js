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
	  let spawn = require("child_process").spawn;
    let child = spawn('python',["python_scripts/word_to_def.py", req.query.def]);

    child.stdout.on('data', (data)=>{
      console.log('on data')
    	res.send({'def': data.toString('utf8')});
    });
})




app.listen(PORT, () => console.log(`Listening on ${ PORT }`))
