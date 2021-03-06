/**
 * Javascript backend code that acts as the server for our
 * web application. We serve both our html pages and audio
 * files and we also call the other python scripts from
 * from this backend script.
 */

//imports used
var http = require('http'),
    express = require('express'),
    path = require('path'),
    bodyParser = require('body-parser'),
    Filter = require('bad-words'),
    ud = require('urban-dictionary');


//port number
const PORT = 1500


//serve these webpages and audio files to home
var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(__dirname+'/static_files/html'));
app.use(express.static(__dirname+'/static_files/css'));
app.use(express.static(__dirname+'/static_files/js'));
app.use(express.static(__dirname+'/static_files/media'));
app.use(express.static(__dirname+'/audio/'));


//Get requests for serving each html page
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


//get request to get the translation of a given text block
//calls python script - word_to_def.py
app.get('/def', function(req, res) {
  let spawn = require("child_process").spawn;
  let child = spawn('python',["python_scripts/word_to_def.py", req.query.def]);

  child.stdout.on('data', (data)=>{
    let filter = new Filter();
    data = filter.clean(data.toString('utf8'));
  	res.send({'def': data.toString('utf8')});
  });
})

//get request to get a list of slang words back
//calls python script - detect_slang.py
app.get('/slang', function(req,res) {
  let spawn = require("child_process").spawn;
  let child = spawn('python',["python_scripts/detect_slang.py", req.query.def]);

  child.stdout.on('data', (data)=>{
      res.send({'words': data.toString('utf8')});
  });
})

//get request to censor new words
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

//get request to convert string to an mp3 file using gTTS
app.get('/tts', function(req, res) {
  let spawn = require("child_process").spawn;
  let child = spawn('python',["python_scripts/tts.py", req.query.def]);

  child.stdout.on('data', (data)=>{
    res.send({'msg': data.toString('utf8')});
  });
})


//serve application on port
app.listen(PORT, () => console.log(`Listening on ${ PORT }`))
