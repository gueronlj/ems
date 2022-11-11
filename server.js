// DEPENDENCIES
const express = require("express")
const mongoose = require("mongoose")
require('dotenv').config()

//CONFIGURATIONS
const app = express();
const db = mongoose.connection;
const PORT = process.env.PORT || 3001;
const MONGODB_URI = process.env.MONGODB_URI;

//MIDDLEWARE
app.use(express.json())

//CONTROLLERS
const employeesController = require('./controllers/employees_controller.js')
app.use('/admin', employeesController)

//CONNECTIONS
mongoose.connect(MONGODB_URI)
db.on('error', (error) => console.log(error.message + ' is Mongod not running?'));
db.on('connected', () => console.log('mongo connected'));
db.on('disconnected', () => console.log('mongo disconnected'));
app.listen(PORT, () => console.log( 'Listening on port:', PORT));
