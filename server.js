const express = require('express');
const app = express();
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const UserController = require('./controllers/UserController');
const cors = require('cors');
const FoodTypeController = require('./controllers/FoodTypeController');
const FoodSizeController = require('./controllers/FoodSizeController');
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


// food type routes
app.post('/api/food-type', (req, res) => FoodTypeController.create(req, res));
app.get('/api/food-type', (req, res) => FoodTypeController.list(req, res));
app.delete('/api/food-type/:id', (req, res) => FoodTypeController.remove(req, res));
app.put('/api/food-type/:id', (req, res) => FoodTypeController.update(req, res));

// food size routes
app.post('/api/food-size', (req, res) => FoodSizeController.create(req, res));
app.get('/api/food-size', (req, res) => FoodSizeController.list(req, res));
app.delete('/api/food-size/:id', (req, res) => FoodSizeController.remove(req, res));
app.put('/api/food-size/:id', (req, res) => FoodSizeController.update(req, res));





// Get all routes
const routes = require('express-list-endpoints');
console.table(routes(app));

app.listen(3000, () => {
    console.log('Server is running on port http://localhost:3000');
});