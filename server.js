///////////////////////////////
// Dependencies
////////////////////////////////
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
const express = require('express');
// create application object
const app = express();
const Stock = require('./models/Stock.js')
const admin = require('firebase-admin');
const {getAuth} = require("firebase-admin/auth");
///////////////////////////////
// Application Settings
////////////////////////////////
require('dotenv').config();

const {
PORT, DATABASE_URL, GOOGLE_PRIVATE_ID, GOOGLE_PRIVATE_KEY, GOOGLE_CLIENT_ID
} = process.env;

admin.initializeApp({
  credential: admin.credential.cert({
    "type": "service_account",
    "project_id": "investing-buddy-app",
    "private_key_id": GOOGLE_PRIVATE_ID,
    "private_key": GOOGLE_PRIVATE_KEY.replace(/\n/g, ''),
    "client_email": "firebase-adminsdk-q0oiv@investing-buddy-app.iam.gserviceaccount.com",
    "client_id": GOOGLE_CLIENT_ID,
    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
    "token_uri": "https://oauth2.googleapis.com/token",
    "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
    "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-q0oiv%40investing-buddy-app.iam.gserviceaccount.com"
  })
})


const stocksRouter = require('./controllers/Stocks');
const usersRouter = require('./controllers/Users');

///////////////////////////////
// Database Connection
////////////////////////////////
mongoose.connect(DATABASE_URL);
// Mongo connection Events
mongoose.connection
  .on('open', () => console.log('You are connected to MongoDB'))
  .on('close', () => console.log('You are disconnected from MongoDB'))
  .on('error', (error) => console.log(`MongoDB Error: ${error.message}`));

///////////////////////////////
// Mount Middleware
////////////////////////////////
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(async function (req, res, next) {
  //capture token
  const token = req.get('Authorization');
  if (token) {
    const user = await getAuth().verifyIdToken(token.replace('Bearer ', ''));
    req.user = user; //adding a logged in user to the request obj
  } else {
    req.user = null;
  }
  next();
})

function isAuthenticated(req, res, next) {
  if (!req.user) {
    return res.status(401).send('You must log in first');
  }
  next();
}


///////////////////////////////
// Mount Routes
////////////////////////////////

app.use('/', stocksRouter);
app.use('/', usersRouter);
//app.use('/', isAuthenticated, stocksRouter);





// create a test route

///////////////////////////////
// Tell the app to listen
////////////////////////////////
app.listen(PORT, () => {
  console.log('Express is listening')
});