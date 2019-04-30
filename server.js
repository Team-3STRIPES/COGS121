var http = require('http'),
    express = require('express'),
    path = require('path'),
    ud = require('urban-dictionary');

var app = express();
const PORT = 1500

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

app.get('/defintion' function(req, res) {
	ud.term(definition).then((result) => {
		const entries = result.entries
		console.log(entries[0].word)
		console.log(entries[0].definition)
		console.log(entries[0].example)
	}).catch((error) => {
		console.error(error.message)
	})
})


app.listen(PORT, () => console.log(`Listening on ${ PORT }`))