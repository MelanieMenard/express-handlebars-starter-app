
const express = require('express');
// const request = require('request');
const hbs = require('express-handlebars');

const app = express();
app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));

// use Handlebars as templating engine instead of Express default one
app.engine('hbs', hbs({
	extname: 'hbs',
	layoutsDir: __dirname + '/views/layouts',
	partialsDir: __dirname + '/views/partials',
	defaultLayout: 'main'
}))
app.set('view engine', 'hbs');

// define the app routes
app.get('/', function (req, res) {

	res.render('pages/home', {
		page_title: 'FgTeaMBR v1.2.1',
		layout: 'main'
	});
});

// make a 404 error page
app.use(function (req, res) {
	res.status(404);
	res.render('pages/404');
});

// handle other errors
app.use(function (err, req, res) {
	res.status(500);
	res.render('pages/error', { error: err });
});

app.listen(app.get('port'), function () {
	console.log('Node app is running on port', app.get('port'));
});
