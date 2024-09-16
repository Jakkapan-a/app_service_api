const express = require('express');
const app = express();
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const UserController = require('./controllers/UserController');
const cors = require('cors')
app.use(cors())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', (req, res) => {
    res.send({ message: 'Server is running' });
});

// sign in a user
app.post('/api/user/signin', (req, res) => UserController.signin(req, res));

// register a new user
app.post('/api/user/signup', (req, res) => UserController.signup(req, res));

app.listen(3000, () => {
    console.log('Server is running on port http://localhost:3000');
});