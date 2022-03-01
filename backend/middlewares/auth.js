const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try{
        const token = req.headers.authorization.split(" ")[1];
        const decodedToken = jwt.verify(token, process.env.TOKEN_PASS);
        const id = decodedToken.userId;
        if(req.body.userId && req.body.userId!==id){
            res.status(500).json({error:"bad token"});
        }else{
            next();
        }
    }catch(error){
        res.status(500).json({error});
    }

}