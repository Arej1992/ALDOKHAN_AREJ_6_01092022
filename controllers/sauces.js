// in controllers/sauces.js

const Thing = require('../models/thing');
const fs = require('fs');




//création de route
exports.createsauces = (req, res, next) => {
  const saucesObject = JSON.parse(req.body.thing);
  delete saucesObject._id;
  delete saucesObject._userId;
  const sauces = new sauces({
      ...thingObject,
      userId: req.auth.userId,
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  });

  sauces.save()
  .then(() => { res.status(201).json({message: 'Objet enregistré !'})})
  .catch(error => { res.status(400).json( { error })})
};




//envoyer les schema sauces sur database(la route implenté)
exports.createsauces = (req, res, next) => {
  const sauces = new sauces({
    title: req.body.title,
    description: req.body.description,
    imageUrl: req.body.imageUrl,
    price: req.body.price,
    userId: req.body.userId
  });
  sauces.save().then(
    () => {
      res.status(201).json({
        message: 'Post saved successfully!'
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


//recupération un thing data base /route ID
exports.getOnesauces = (req, res, next) => {
  sauces.findOne({
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


//Modificatoin un thing /objet (route)
exports.modifysauces = (req, res, next) => {
  const sauces = new sauces({
    _id: req.params.id,
    title: req.body.title,
    description: req.body.description,
    imageUrl: req.body.imageUrl,
    price: req.body.price,
    userId: req.body.userId
  });
  sauces.updateOne({_id: req.params.id}, sauces).then(
    () => {
      res.status(201).json({
        message: 'Thing updated successfully!'
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


//suppression un thing
exports.deletesauces = (req, res, next) => {
  sauces.deleteOne({_id: req.params.id}).then(
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


 //contenu dynamique enregistre les informations dans data base
exports.getAllsauces = async (req, res, next) => {
  try {
    const sauces = await Sauce.find()
      .then((sauce) => res.json(sauce))
      .catch((error) => res.status(400).json({ error }));
  } catch (error) {
    return res.status(500).json({ error });
  }
};





//Modifier route put fichier
exports.modifysauces = (req, res, next) => {
  const saucesObject = req.file ? {
      ...JSON.parse(req.body.thing),
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  } : { ...req.body };

  delete saucesObject._userId;
  sauces.findOne({_id: req.params.id})
      .then((sauces) => {
          if (sauces.userId != req.auth.userId) {
              res.status(401).json({ message : 'Not authorized'});
          } else {
              sauces.updateOne({ _id: req.params.id}, { ...thingObject, _id: req.params.id})
              .then(() => res.status(200).json({message : 'Objet modifié!'}))
              .catch(error => res.status(401).json({ error }));
          }
      })
      .catch((error) => {
          res.status(400).json({ error });
      });
};

//suprimer fichier
exports.deletesauces = (req, res, next) => {
  sauces.findOne({ _id: req.params.id})
      .then(sauces => {
          if (sauces.userId != req.auth.userId) {
              res.status(401).json({message: 'Not authorized'});
          } else {
              const filename = sauces.imageUrl.split('/images/')[1];
              fs.unlink(`images/${filename}`, () => {
                  sauces.deleteOne({_id: req.params.id})
                      .then(() => { res.status(200).json({message: 'Objet supprimé !'})})
                      .catch(error => res.status(401).json({ error }));
              });
          }
      })
      .catch( error => {
          res.status(500).json({ error });
      });
};

