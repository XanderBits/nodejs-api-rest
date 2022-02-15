const express = require('express');
const app = express();
const mongoose = require('mongoose');
const users = require('./routes/users');
const courses = require('./routes/courses');

app.use(express.json());
app.use(express.urlencoded({extended : true}));
app.use('/api/users', users);
app.use('/api/courses', courses); 

const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`Server listening on port: ${port}`));

mongoose.connect('mongodb://localhost:27017/nodeApi')
    .then(() => console.log("Connected to data base"))
    .catch(err => console.log(err));