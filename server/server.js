const express = require('express');
const models = require('./models');
const expressGraphQL = require('express-graphql');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const schema = require('./schema/schema');


const app = express();


const MONGO_URI = "mongodb+srv://new-user:torcida@cluster0.qlcdnfi.mongodb.net/test?retryWrites=true&w=majority";
if (!MONGO_URI) {
  throw new Error('You must provide a MongoLab URI');
}

//Previous error, await only valid as async function and top level bodies of modules

mongoose.connect(MONGO_URI, { useUnifiedTopology: true });
mongoose.connection
    .once('open', () => console.log('Connected to MongoLab instance.'))
    .on('error', error => console.log('Error connecting to MongoLab:', error))
    
 
process.on('SIGINT', () => {
    mongoose.connection.close(() => {
      process.exit(0);
    });
  });

/*

mongoose.disconnect()
try {
	Mongoose.connect(MONGO_URI, MONGO_CONFIG)
		.then((db) => {
			console.log('Mongoose connection Established')
			db.connection.on('error', (err) => { console.error(err) }) // <- print nothing
			db.connection.on('disconnected', () => { console.log('disconnected') }) // <- print once
			db.connection.on('reconnected', () => { console.log('reconnected') }) // <- never printed
		})
} catch (error) {
	console.error(error.message)
	console.log('Mongoose connection Failed')
	process.exit(1)
}
*/

app.use(bodyParser.json());
app.use('/graphql', expressGraphQL({
  schema,
  graphiql: true
}));

const webpackMiddleware = require('webpack-dev-middleware');
const webpack = require('webpack');
const webpackConfig = require('../webpack.config.js');
app.use(webpackMiddleware(webpack(webpackConfig)));

module.exports = app;