const bc = require("bcrypt");
const jwt = require('jsonwebtoken');
const modelUser = require("../models/user.model");

exports.signup =(req, res, next) => {
    bc.hash(req.body.password, 10)
    .then(hash => {
        const user = new modelUser({
            email: req.body.email,
            password: hash
        });
        user.save()
        .then(() => res.status(201).json({ message: 'Objet enregistré !'}))
        .catch(error => res.status(400).json({ error: error }));
    });
};

exports.login = (req, res, next) => {
    modelUser.findOne({ email: req.body.email}, (error, result)=>{
        if(error)
            res.status(404).json({error});
        else{
            bc.compare(req.body.password, result.password)
            .then((validated)=>{
                if (!validated){
                    res.status(500).json({"error":"password does not match user"});
                }else{
                    res.status(202);
                    res.send(JSON.stringify(
                        {
                            userId: result._id,
                            token: jwt.sign( { userId: result._id },process.env.TOKEN_PASS,{ expiresIn: '24h' } )
                        }
                    ));
                }
            })
            .catch(error => {
                console.log(error);
                res.status(500).json({error:"fail to compare hash", message:error});
            })
        }
    })
};