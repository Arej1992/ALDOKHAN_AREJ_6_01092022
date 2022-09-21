const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require('path');
const helmet = require('helmet')
const userRoutes = require('./router/user');
const saucesRoutes = require('./router/sauces');

require("dotenv").config()

//Connection avec db
mongoose
  .connect(
    process.env.db,
   { 
      useNewUrlParser: true,
      useUnifiedTopology: true 
   })
  .then(() => console.log("connected"))
  .catch(() => console.log("Connexion à MongoDB échouée !"));



  //lie entre frontend+backend++accès sur les data
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*"); //* ca veut dire accessible pour tout le monde.
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  next();
});


app.use(express.json());

app.use('/images', express.static(path.join(__dirname, 'images')));

app.use(helmet());

app.use('/api/auth', userRoutes);
app.use('/api/sauces', saucesRoutes);


module.exports = app;
