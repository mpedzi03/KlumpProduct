var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var expressValidator = require('express-validator');
var mongojs = require('mongojs');
var db = mongojs('student_database', ['students']);
var ObjectId = mongojs.ObjectId;



var app = express();

//Express Validator Middleware 
app.use(expressValidator());

var teamMembers = [
	{
		"FirstName":"Michael",
		"LastName":"Pedzimaz",
		"PreferredName":"Mike",
		"TeamName":"The Ocelots",
		"SeatLocation":"2-1",
		"Role":["UI Designer"]
	},
	{
		"FirstName":"Jake",
  		"LastName":"Walenga",
  		"PreferredName":"Jake",
  		"TeamName":"The Ocelots",
  		"SeatLocation":"1-3",
  		"Role":["Product Owner"]
	},
	{
		"FirstName":"Edwin",
 		"LastName":"Moses",
		"PreferredName":"Julian",
		"TeamName":"The Ocelots",
 		"SeatLocation":"0-3",
		"Role":["Scrum Master"]
	},
	{
		"FirstName":"Jace",
  		"LastName":"Horner",
  		"PreferredName":"Jace",
  		"TeamName":"The Ocelots",
  		"SeatLocation":"0-2",
  		"Role":["Developer"]
	},
	{
		"FirstName":"Thaddeus",
  		"LastName":"Albert",
  		"PreferredName":"Thad",
  		"TeamName":"The Ocelots",
  		"SeatLocation":"1-2",
  		"Role":["Developer"]
	}

]	

// View Engine
app.set('view engine','ejs');
app.set('views', path.join(__dirname, 'views'));

//Body Parser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

//Set Static Path
app.use(express.static(path.join(__dirname, 'public')));

//Global Vars
app.use(function(req, res, next){
	res.locals.errors = null;
	next();
	
});


app.get('/', function(req, res){
	db.students.find(function (err, docs) {
		res.render('index', {
			title: 'Students',
			students: docs
		});
	})
	
});
	
app.post('/students/add', function(req, res){
	
	req.checkBody('FirstName', 'First Name is Required').notEmpty();
	req.checkBody('LastName', 'Last Name is Required').notEmpty();
	req.checkBody('PreferredName', 'Preferred Name is Required').notEmpty();
	req.checkBody('TeamName', 'Team Name is Required').notEmpty();
	req.checkBody('SeatLocation', 'Seat Location is Required').notEmpty();
	req.checkBody('Role', 'Role is Required').notEmpty();
	
	
	var errors = req.validationErrors();
	if (errors){
		res.render('index', {
			title: 'Students',
			students:students,
			errors: errors
		});
	}else {
		var newStudent = {
			FirstName: req.body.FirstName,
			LastName: req.body.LastName,
			PreferredName: req.body.PreferredName,
			TeamName: req.body.TeamName,
			SeatLocation: req.body.SeatLocation,
			Role: req.body.Role
		}
		db.students.insert(newStudent, function(err, result){
			if(err){
				console.log(err);
			}
			res.redirect('/');
		});
	}	
});

app.delete('/students/delete/:id',function(req, res){
	db.students.remove({_id: ObjectId(req.params.id)}, function(err, result){
		if(err){
			console.log(err);
		}
		res.redirect('/');
	});
});

app.listen(3000, function(){
	console.log('Server Started on Port 3000...');
});