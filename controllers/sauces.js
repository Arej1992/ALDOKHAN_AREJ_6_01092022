//  controllers/sauces.js

const Sauces = require("../models/sauces");
const fs = require("fs");

//envoyer les schema sauces sur database(la route implenté)


exports.createsauces = (req, res, next) => {
  const sauceObject = JSON.parse(req.body.sauce);
  // delete sauceObject._id;
  const sauce = new Sauces({
    ...sauceObject,
    likes: 0,
    dislikes: 0,
    usersLiked: [],
    usersDisliked: [],
    // http://localhost:3000/images/1662648355155-299811405_2660138807450930_5936707431684283662_n.jpeg
    imageUrl: `${req.protocol}://${req.get("host")}/images/${
      req.file.filename
    }`,
  });
  sauce
    .save()
    .then(() => res.status(201).json({ message: "sauce créée !" }))
    .catch((error) => res.status(400).json({ error }));
};

//recupération un suace data base /route ID
exports.getOnesauces = async (req, res, next) => {
  await Sauces.findOne({
    _id: req.params.id,
  })
    .then((sauce) => {
      res.status(200).json(sauce);
    })
    .catch((error) => {
      res.status(404).json({
        error: error,
      });
    });
};

//suppression un sauce

exports.deletesauces = (req, res, next) => {
  Sauces.findOne({ _id: req.params.id })
    .then((Sauce) => {
      // sauce.imageUrl = http://localhost:3000/images/1662648355155-299811405_2660138807450930_5936707431684283662_n.jpeg
      // .split("/images/") = [http://localhost:3000, 1662648355155-299811405_2660138807450930_5936707431684283662_n.jpeg]
      // [1] = 1662648355155-299811405_2660138807450930_5936707431684283662_n.jpeg
      const filename = Sauce.imageUrl.split("/images/")[1];
      fs.unlink(`./images/${filename}`, () => {
        Sauce.deleteOne({ _id: req.params.id })
          .then(() => res.status(200).json({ message: "Sauce supprimée !" }))
          .catch((error) => res.status(400).json({ error }));
      });
    })
    .catch((error) => res.status(500).json({ error }));
};

//contenu dynamique enregistre les informations dans data base
exports.getAllsauces = async (req, res, next) => {
  try {
    const sauces = await Sauces.find()
      .then((sauce) => res.json(sauce))
      .catch((error) => res.status(400).json({ error }));
  } catch (error) {
    return res.status(500).json("error");
  }
};

 //Modifier route put fichier

exports.modifysauces = (req, res, next) => {
  Sauces.findOne({ _id: req.params.id })
    .then((sauce) => {
      // sauce.imageUrl = http://localhost:3000/images/1662648355155-299811405_2660138807450930_5936707431684283662_n.jpeg
      // .split("/images/") = [http://localhost:3000, 1662648355155-299811405_2660138807450930_5936707431684283662_n.jpeg]
      // [1] = 1662648355155-299811405_2660138807450930_5936707431684283662_n.jpeg

      const filename = sauce.imageUrl.split("/images/")[1];
      // condition pour confirmer si l'utilisatuer a changé l'image et il était bien supprimé 
      
      if (req.file) {
        // images/62648355155-299811405_2660138807450930_5936707431684283662_n.jpeg
        fs.unlink(`images/${filename}`, (err) => {
          
          if (err) throw err;
        });
      }
      const sauceObject = req.file// file(nouveau img) front end va envoyer 
      //if le frontend envoyer et changer une image 
        ? {
            ...JSON.parse(req.body.sauce),
            //revenir sur l'ancienne protocole https....pour envoyer database
            imageUrl: `${req.protocol}://${req.get("host")}/images/${
              req.file.filename
            }`,
          }
        : { ...req.body };

        //database
      Sauces.updateOne(
        { _id: req.params.id },
        { ...sauceObject, _id: req.params.id }
      )
        .then(() => res.status(200).json({ message: "Sauce modifiée" }))
        .catch((error) => res.status(400).json({ error }));
    })
    .catch((error) => res.status(400).json({ error }));
};

//*************like/dislike************ */
exports.likeDislikeSauce = (req, res, next) => {
  const vote = req.body.like;
  switch (vote) {
    //l'utilisateur aime : on ajoute son id au tableau et on incrémente les likes
    case 1:
      Sauces.updateOne(
        { _id: req.params.id },
        {
          $inc: { likes: +1 },
          $push: { usersLiked: req.body.userId },
        }
      )
        .then(() => res.status(201).json({ message: "like ajouté" }))
        .catch((error) =>
          res.status(500).json({ message: "like erreur :" + error })
        );
      break;

    //l'utilisateur n'aime pas : on ajoute son id au tableau et on incrémente les likes
    case -1:
      Sauces.updateOne(
        { _id: req.params.id },
        {
          $push: { usersDisliked: req.body.userId },
          $inc: { dislikes: +1 },
        }
      )
        .then(() => res.status(201).json({ message: "dislike est ajouté" }))
        .catch((error) =>
          res.status(500).json({ message: "disliked erreur" + error })
        );
      break;

    //l'utilisateur annule son choix : on retire l'utilisateur du tableau et on désincrémente les likes ou dislikes suivant le tableau dans lequel il se trouvait
    case 0:
      Sauces.findOne({ _id: req.params.id })
        .then((sauce) => {
          if (sauce.usersLiked.includes(req.body.userId)) {
            Sauces.updateOne(
              { _id: req.params.id },
              {
                $pull: { usersLiked: req.body.userId },
                $inc: { likes: -1 },
              }
            )
              .then(() =>
                res.status(201).json({ message: "like a été retiré !" })
              )
              .catch((error) =>
                res
                  .status(500)
                  .json({ message: "like a été retiré ! erreur" + error })
              );
          } else {
            Sauces.updateOne(
              { _id: req.params.id },
              {
                $pull: { usersDisliked: req.body.userId },
                $inc: { dislikes: -1 },
              }
            )
              .then(() =>
                res.status(201).json({ message: "disliked a été retiré !" })
              )
              .catch((error) =>
                res
                  .status(500)
                  .json({ message: "disliked a été retiré erreur !" + error })
              );
          }
        })
        .catch((error) =>
          res.status(500).json({ message: "eureur  " + error })
        );
      break;

    default:
      console.log(req.body);
  }
};
