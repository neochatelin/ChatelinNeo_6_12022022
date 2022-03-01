const fs = require("fs");
const sauceModel = require("../models/sauce.model");
const modelSauce = require("../models/sauce.model");

exports.getAll = (req,res, next) => {
    let sauceArry = new Array;
    modelSauce.find({}, (err, sauces)=>{
        sauces.forEach((sauce)=>{
            sauceArry.push(sauce);
        })
        res.status(200).json(sauceArry);
    });
};
exports.create = (req, res, next) => {
    let obj = JSON.parse(req.body.sauce);
    const sauce = new modelSauce({
        userId: obj.userId,
        name: obj.name,
        manufacturer: obj.manufacturer,
        description: obj.description,
        mainPepper: obj.mainPepper,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
        heat: obj.heat,
        likes: 0,
        dislikes: 0,
        usersLiked: [],
        usersDisliked: []
    });
    sauce.save()
    .then(() => res.status(201).json({message: 'Objet enregistré !'}))
    .catch(err => res.status(400).json({"message error": err}));
};

exports.getOne = (req, res, next) => {
    let id = req.originalUrl.split("/")[3];
    modelSauce.findOne({_id: id}, (err, sauce)=>{
        res.status(200).json(sauce);
    })
};
exports.updateSauce = (req, res, next) => {
    let sauce_id = req.originalUrl.split("/")[3];
    modelSauce.updateOne({_id: sauce_id}, {
        userId: req.body.userId,
        name: req.body.name,
        manufacturer: req.body.manufacturer,
        description: req.body.description,
        mainPepper: req.body.mainPepper,
        heat: req.body.heat
    }, (err, sauce)=>{
            if (err){
            console.log(err)
        }
        else{
            res.status(200).json({"Updated sauce": sauce});
        }
    });
};
exports.remove = (req, res, next) => {
    let sauce_id = req.originalUrl.split("/")[3];
    modelSauce.findOne({_id: sauce_id}, (err, sauce)=>{
        if(err)
            res.status(400).json({err})
        else{
            fs.unlink(`images/${sauce.imageUrl}`.split("images/")[1], ()=>{
                modelSauce.deleteOne({_id: sauce_id});
            });
        }
    });
    res.status(200).json({message: "Objet suprimer"});
};

exports.like = (req, res, next) => {
    let sauce_id = req.originalUrl.split("/")[3];
    modelSauce.updateMany({_id: sauce_id}, {$pull: {usersLiked: [sauce_id]}, $pull: {usersDisliked: [sauce_id]}},
        (err, sauce)=>{
            if (err){
                res.status(400).json({err});
            }
            else{
                if(req.body.like === 1){
                    modelSauce.updateMany({_id: sauce_id}, {$push: {usersLiked: [sauce_id]}});
                }
                else if(req.body.like === -1){
                    modelSauce.updateMany({_id: sauce_id}, {$push: {usersDisliked: [sauce_id]}});
                }
                console.log(sauce);
            }
        }
    );
    res.status(200).json({message: ""});
};