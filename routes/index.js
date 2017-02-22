var express = require('express');
var router = express.Router();
var path = require("path");
var audio = path.join(__dirname, "../public/audio");

/* GET home page. */
router.get('/', function(req, res, next) {
	var fs = require("fs");
	fs.readdir(audio, function(err, names) {
		if(err) {
			console.log(err);
		}else {
			res.render('index', { title: 'Countdown', music: names });
		}
	});
});

module.exports = router;
