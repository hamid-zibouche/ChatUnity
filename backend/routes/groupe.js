const express =  require('express')
const router = express.Router()
const passport = require('passport')
const Sequelize = require('sequelize')

require('dotenv').config();

const {isAdminGroupe} = require("../middlewares/authAdminGroupe")

const MembresGroupe = require("../models/membresGroupe")
const UserModel = require('../models/utilisateurs');


const Groupe = require('../models/groupe');



const verifieJWT = passport.authenticate('jwt',{session:false},)

//inza

//creation groupe et ajouter le createur comme membere
router.post('/Group/create',verifieJWT, async (req, res) => {
  const { nom } = req.body;
  const image = req.files ? req.files.image : null
  const imageBlob = image ? image.data : "null"

  try {
    // Vérifiez si le nom du groupe est présent
    if (!nom || nom.trim().length === 0) {
      return res.status(400).json({ error: 'Le nom du groupe est obligatoire.' });
    }

    // Créez le groupe en utilisant le nom et l'image fournis
    let newGroupe = await Groupe.create({
      nom: nom.trim(),
      idAdmin: req.user.id,
      image: imageBlob, // Utilisez l'image fournie si elle existe, sinon null
    });
    
    await MembresGroupe.create({
      idGroupe: newGroupe.id,
      idUser: req.user.id
    });

    res.status(200).send(newGroupe);
  } catch (error) {
    console.error('Erreur:', error);
    res.status(500).send('Erreur serveur');
  }
});



// Update Group

    // modification du nom du groupe 

router.put('/Group/update/nom/:groupId',isAdminGroupe, async (req, res) => {
  const groupId = req.params.groupId;
  const { nom} = req.body;

  try {

    if (!nom || nom.trim().length === 0) {
      return res.status(400).json({ error: 'Le nom du groupe est obligatoire.' });
    }

    const existingGroup = await Groupe.findOne({
      where: { id: groupId }
    });

    if (existingGroup) {
      if(nom.trim() === existingGroup.nom){
        return res.status(400).json({ error: "Le nom est identique avec l'encien " });
      }
      const newNameGroupe = await Groupe.update({
        nom: nom.trim()
      }, {
        where: { id: groupId }
      });

      res.status(200).send(`Groupe avec l'ID ${groupId} mis à jour avec succès`);
    } else {
      res.status(404).send(`Aucun groupe trouvé avec l'ID ${groupId}`);
    }

  } catch (error) {
    console.error('Erreur:', error);
    res.status(500).send('Erreur serveur');
  }
});

  //modification de l'image du profil du groupe

router.put('/Group/update/image/:groupId',isAdminGroupe, async (req, res) => {
  const groupId = req.params.groupId;
  const { image } = req.body;

  try {
    const existingGroup = await Groupe.findOne({
      where: { id: groupId }
    });

    if (existingGroup) {
      await Groupe.update({
        image: `${image}`,
      }, {
        where: { id: groupId }
      });

      res.status(200).send(`Groupe avec l'ID ${groupId} mis à jour avec succès`);
    } else {
      res.status(404).send(`Aucun groupe trouvé avec l'ID ${groupId}`);
    }

  } catch (error) {
    console.error('Erreur:', error);
    res.status(500).send('Erreur serveur');
  }
});


// Get All Groups de l'utilisateur courant
router.get('/Groupe/mesGroupes',verifieJWT, async (req, res) => {
  try {
    const allGroups = await MembresGroupe.findAll({where:{idUser:req.user.id}});

    const groupList = await Promise.all(
      allGroups.map(async (group) => {
        let grp = await Groupe.findOne({
          where: { id: group.dataValues.idGroupe }
        });
        return grp;
      })
    );
    
    res.status(200).json(groupList);

  } catch (error) {
    console.error('Erreur:', error);
    res.status(500).send('Erreur serveur');
  }
});

//rechercher les utilisateur qui ne sont pas deja memebre dans un groupe donné
router.get('/groupe/:idGroup/users/findByPseudo/:pseudo',  async (req, res) => {
  try {

    const pseudo = req.params.pseudo
    const idGroup = req.params.idGroup

    const membersInGroup = await MembresGroupe.findAll({
      attributes: ['idUser'],
      where: { idGroupe: idGroup },
    });

    // Get users whose pseudo is like the specified pseudo and are not members of the group
    const users = await UserModel.findAll({
      where: {
        [Sequelize.Op.and]: [
          Sequelize.where(
            Sequelize.fn('LOWER', Sequelize.col('pseudo')),
            'LIKE',
            `%${pseudo.trim().toLowerCase()}%`
          ),
          {
            id: {
              [Sequelize.Op.notIn]: membersInGroup.map((member) => member.idUser),
            },
          },
        ],
      },
    });

    console.log('--------->W',users)

    if (!users) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    res.status(200).json(users);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Erreur serveur', error});
  }
});    


// Delete Group
router.delete('/Group/delete/:groupId',isAdminGroupe, async (req, res) => {

  const groupId = req.params.groupId;
  try {
    const result = await Groupe.destroy({
      where: { id: groupId }
    });

    if (result) {
      res.status(200).send(`Groupe avec l'ID ${groupId} supprimé avec succès`);
    } else {
      res.status(404).send(`Aucun groupe trouvé avec l'ID ${groupId}`);
    }

  } catch (error) {
    console.error('Erreur:', error);
    res.status(500).send('Erreur serveur');
  }
});

// MembresGroupe

 // Route pour ajouter un membre à un groupe
router.post('/Group/:groupId/addMember', isAdminGroupe, async (req, res) => {
  const groupId = req.params.groupId;
  const { idUser } = req.body;
  console.log('-----------',idUser)

  try {
    // Vérifier si le membre n'est pas déjà ajouté au groupe
    const existingMember = await MembresGroupe.findOne({
      where: { idGroupe: groupId, idUser: idUser },
    });

    if (existingMember) {
      res.status(400).json({ message: 'Ce membre est déjà ajouté au groupe.' });
      return;
    }

    // Ajouter le membre au groupe
    await MembresGroupe.create({
      idGroupe: groupId,
      idUser: idUser
    });
    console.log(('Membre ajouté au groupe avec succès'))
    res.status(200).json({ message: 'Membre ajouté au groupe avec succès',idUser });
  } catch (error) {
    console.error('Erreur :', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});


// Route pour afficher la liste des membres d'un groupe
router.get('/Group/:groupId/members', isAdminGroupe, async (req, res) => {
  const groupId = req.params.groupId;
  console.log(idUser)

  try {
    // Récupérer la liste des membres du groupe
    const groupMembers = await MembresGroupe.findAll({
      where: { idGroupe: groupId },
    });

    res.status(200).json({ members: groupMembers });
  } catch (error) {
    console.error('Erreur :', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});


// Route pour supprimer un membre d'un groupe
router.delete('/Group/:groupId/removeMember/:userId', isAdminGroupe, async (req, res) => {
  const groupId = req.params.groupId;
  const userId = req.params.userId;
 console.log(groupId ,userId)
  try {
    // Vérifier si le membre est dans le groupe
    const existingMember = await MembresGroupe.findOne({
      where: { idGroupe: groupId, idUser: userId },
    });

    if (!existingMember) {
      res.status(404).json({ message: 'Ce membre n\'est pas présent dans le groupe.' });
      return;
    }

    // Supprimer le membre du groupe
    await MembresGroupe.destroy({
      where: { idGroupe: groupId, idUser: userId },
    });

    res.status(200).json({ message: 'Membre supprimé du groupe avec succès' });
  } catch (error) {
    console.error('Erreur :', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});



module.exports = router;