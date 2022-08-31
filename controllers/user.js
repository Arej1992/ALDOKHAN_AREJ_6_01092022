const bcrypt = require('bcrypt');
const User = require('../models/user');

const jwt = require('jsonwebtoken');



// //créer d'utilisateur
exports.signup = (req, res, next) => {
    console.log(req.body)
    bcrypt.hash(req.body.password, 10)
      .then(hash => {
        const user = new User({
          email: req.body.email,
          password: hash
        });
        // console.log(user)
        user.save()
          .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
          .catch(error => res.status(400).json({ error }));
      })
      .catch(error => res.status(500).json({ error }));
  };

 
  //vérifiez si utilsiateur existe dans basedonnée et si le password coresspondant
  //si un mot de passe entré par l'utilisateur correspond
  // à un hash sécurisé enregistré en base de données.

  exports.login = (req, res, next) => {
    User.findOne({ email: req.body.email })
        .then(user => {
            if (!user) {
                return res.status(401).json({ message: 'Paire login/mot de passe incorrecte'});
            }

        const token = jwt.sign({id: user.id} , "RANDOM_TOKEN_SECRET")
            bcrypt.compare(req.body.password, user.password)
                .then(valid => {
                    if (!valid) {
                        return res.status(401).json({ message: 'Paire login/mot de passe incorrecte' });
                    }
                    res.status(200).json({
                        userId: user._id,
                        token: token
                    });
                })
                .catch(error => res.status(500).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
 };