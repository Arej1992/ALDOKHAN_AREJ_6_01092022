// in controllers/sauces.js

const Sauces = require('../models/thing');
const fs = require('fs');


//envoyer les schema sauces sur database(la route implenté)

// التعديل 
  exports.createsauces =  (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce);
    delete sauceObject._id;
    const sauce =  new Sauces({
        ...sauceObject,
        likes: 0,
        dislikes: 0,
        usersLiked: [],
        usersDisliked: [],
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });
    sauce.save()
        .then(() => res.status(201).json({ message: 'sauce créée !' }))
        .catch(error => res.status(400).json({ error }))
};

//recupération un thing data base /route ID
exports.getOnesauces = async (req, res, next) => {
 await Sauces.findOne({
    _id: req.params.id
  }).then(
    (sauces) => {
      res.status(200).json(sauces);
    }
  ).catch(
    (error) => {
      res.status(404).json({
        error: error
      });
    }
  );
};





//suppression un thing
exports.deletesauces = (req, res, next) => {
  Sauces.deleteOne({_id: req.params.id}).then(
    () => {
      res.status(200).json({
        message: 'Deleted!'
      });
    }
  ).catch(
    (error) => {
      res.status(400).json({
        error: error
      });
    }
  );
};


//  //contenu dynamique enregistre les informations dans data base
exports.getAllsauces = async (req, res, next) => {
  try {
    const sauces = await Sauces.find()
      .then((sauce) => res.json(sauce))
      .catch((error) => res.status(400).json({ error }));
  } catch (error) {
    return res.status(500).json( 'error' );
  }
};



// //Modifier route put fichier

      exports.modifysauces = (req, res, next) => {
        Sauces.findOne({ _id: req.params.id })
            .then(sauce => {
                const filename = sauce.imageUrl.split('/images/')[1];
                if (req.file) {
                    fs.unlink(`images/${filename}`, (err) => {
                        if (err) throw err;
                    })
                }
                const sauceObject = req.file ?
                    {
                        ...JSON.parse(req.body.sauce),
                        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
                    } : { ...req.body };
                Sauces.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
                    .then(() => res.status(200).json({ message: 'Sauce modifiée' }))
                    .catch(error => res.status(400).json({ error }));
            })
            .catch(error => res.status(400).json({ error }));
      };



