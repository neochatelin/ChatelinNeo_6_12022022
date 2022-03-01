const express = require("express");
const mongoose = require('mongoose');
const helmet = require('helmet');

const userRoutes = require('./routes/user.routes');
const sauceRoutes = require('./routes/sauce.routes');

const dotenv = require('dotenv');
dotenv.config({path:"./config/.env"});

let app = express();

app.use(helmet());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.BD_CLUSTER}.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
mongoose.connect(uri, { useNewUrlParser: true,
                        useUnifiedTopology: true})
.then(() => console.log('Connexion à MongoDB réussie !'))
.catch((err) => console.log('Connexion à MongoDB échouée !',err));

app.use((req, res, next)=>{
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
})

app.use(express.urlencoded({extended:true}));
app.use(express.json());

app.use('/images', express.static('./images'));
app.use('/api/auth', userRoutes);
app.use('/api/sauces', sauceRoutes);

app.listen(3000);