var http = require('http'),
    express = require('express'),
    path = require('path'),
    bodyParser = require('body-parser'),
    Filter = require('bad-words'),
    ud = require('urban-dictionary');

const PORT = 1500

var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static(__dirname+'/static_files/html'));
app.use(express.static(__dirname+'/static_files/css'));
app.use(express.static(__dirname+'/static_files/js'));
app.use(express.static(__dirname+'/static_files/media'));
app.use(express.static(__dirname+'/audio/'));

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
  console.log("def got pinged")
  let spawn = require("child_process").spawn;
  let child = spawn('py',["python_scripts/word_to_def.py", req.query.def]);

  child.stdout.on('data', (data)=>{
    console.log('on data')
    let filter = new Filter();
    data = filter.clean(data.toString('utf8'));
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

app.get('/new_word', function(req, res){
  ud.term(req.query.def, (error, entries, tags, sounds) => {
    if (error) {
      res.send({'def': ""});
    } else {
      let filter = new Filter();
      let data = filter.clean(entries[0].definition+"");
      res.send({'def': data.toString('utf8')});
    }
  })
}) 

app.get('/tts', function(req, res) {
  console.log("tts got pinged") 
  console.log(req.query.def)
  let spawn = require("child_process").spawn;
  let child = spawn('py',["python_scripts/tts.py", req.query.def]);

  child.stdout.on('data', (data)=>{
    console.log(data.toString('utf8'))
    res.send({'msg': data.toString('utf8')});
  });
})

app.listen(PORT, () => console.log(`Listening on ${ PORT }`))
