'use strict';

require('dotenv').load();

const express = require('express');
const cors = require('cors');
const Promise = require('bluebird');
const errorHandler = require('./lib/error-middleware');
const bodyParser = require('body-parser').json();
const mongoose = require('mongoose');

const app = module.exports = express();
const router = express.Router();
const userRoutes = require('./routes/user-routes')(router);
const galleryRoutes = require('./routes/gallery-routes')(router);
const picRoutes = require('./routes/pic-routes')(router);

const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost/cfgram-dev';

mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI);

app.use(cors());
app.use(errorHandler);
app.use(bodyParser);

app.use('/api', userRoutes);
app.use('/api', galleryRoutes);
app.use('/api', picRoutes);

app.listen(PORT, () => console.log(`Listening on ${PORT}`));
