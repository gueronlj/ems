// DEPENDENCIES
const express = require("express")
const mongoose = require("mongoose")
require('dotenv').config();
const jwt = require('express-jwt');
const jwks = require('jwks-rsa');
const cors = require('cors')

//CONFIGURATIONS
const app = express();
const db = mongoose.connection;
const PORT = process.env.PORT || 3001;
const MONGODB_URI = process.env.MONGODB_URI;

const jwtCheck = () => jwt({
      secret: jwks.expressJwtSecret({
          cache: true,
          rateLimit: true,
          jwksRequestsPerMinute: 5,
          jwksUri: 'https://dev-rqbvmubwc6xeogdn.us.auth0.com/.well-known/jwks.json'
    }),
    audience: 'http://localhost:3000',
    issuer: 'https://dev-rqbvmubwc6xeogdn.us.auth0.com/',
    algorithms: ['RS256']
});

//MIDDLEWARE
app.use(express.json())
app.use(cors())
app.use(jwtCheck);

//CONTROLLERS
const employeesController = require('./controllers/employees_controller.js')
app.use('/admin', employeesController)

const scheduleController =  require('./controllers/schedule_controller.js')
app.use('/schedule', scheduleController)

const reportController = require('./controllers/report_controller.js')
app.use('/report', reportController)

//CONNECTIONS
mongoose.connect(MONGODB_URI)
db.on('error', (error) => console.log(error.message + ' is Mongod not running?'));
db.on('connected', () => console.log('mongo connected'));
db.on('disconnected', () => console.log('mongo disconnected'));
app.listen(PORT, () => console.log( 'Listening on port:', PORT));
