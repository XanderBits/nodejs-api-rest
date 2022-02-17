const express = require('express');
const app = express();
const config = require('config');
const mongoose = require('mongoose');
const users = require('./routes/users');
const courses = require('./routes/courses');
const auth = require('./routes/auth');

app.use(express.json());
app.use(express.urlencoded({extended : true}));
app.use('/api/users', users);
app.use('/api/courses', courses);
app.use('/api/auth', auth) 

const port = process.env.PORT || 3000;
const dbConfig = config.get('dbConfig.host')

app.listen(port, () => console.log(`Server listening on port: ${port}`));

mongoose.connect(dbConfig)
    .then(() => console.log("Connected to data base"))
    .catch(err => console.log(err));