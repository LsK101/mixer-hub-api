require('dotenv').config();
const bodyParser = require('body-parser');
const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');

const {router: recipesRouter} = require('./recipes');

mongoose.Promise = global.Promise;

const {PORT, DATABASE_URL, CLIENT_ORIGIN} = require('./config');

app.use(
	cors({
 		origin: CLIENT_ORIGIN
 	})
);

app.use('/api/recipes', recipesRouter);

app.get('/api/*', (req, res) => {
	res.json({ok: true});
});

// START/STOP SERVER HANDLING
let server;

function runServer() {
	return new Promise((resolve, reject) => {
		mongoose.connect(DATABASE_URL, err => {
			if (err) {
				return reject(err);
			}
			server = app.listen(PORT, () => {
				console.log(`Listening on port ${PORT}`);
				resolve();
			})
			.on('error', err => {
				mongoose.disconnect();
				reject(err);
			});
		});
	});
}

function closeServer() {
	return mongoose.disconnect().then(() => {
		return new Promise((resolve, reject) => {
			console.log('Closing server');
			server.close(err => {
				if (err) {
					return reject(err);
				}
				resolve();
			});
		});
	});
}


if (require.main === module) {
	runServer().catch(err => console.error(err));
}

module.exports = {app, runServer, closeServer};