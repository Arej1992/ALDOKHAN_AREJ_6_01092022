const express = require("express");
const app = express();
// const bodyParser = require ("body-Parser");
const mongoose = require("mongoose");
const path = require('path');

const userRoutes = require('./router/user');
const saucesRoutes = require('./router/sauces');




//  mongoose.connect('mongodb+srv://:@cluster0.mongodb.net/test?retryWrites=true&w=majority',
//   { useNewUrlParser: true,
//     useUnifiedTopology: true })
//   .then(() => console.log('Connexion à MongoDB réussie !'))
//   .catch((err) => console.log('Connexion à MongoDB échouée !' , err));

mongoose
  .connect(
   "mongodb+srv://UserHotTakes:FfCBNMfJdfmhgGfq@cluster0.3vdwegh.mongodb.net/HotTakes?retryWrites=true&w=majority" ,  
   { 
      useNewUrlParser: true,
      useUnifiedTopology: true 
   })
  .then(() => console.log("connected"))
  .catch(() => console.log("Connexion à MongoDB échouée !"));





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
app.use('/api/auth', userRoutes);
app.use('/api/sauces', saucesRoutes);


module.exports = app;
