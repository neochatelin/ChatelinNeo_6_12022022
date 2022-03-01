const express = require('express');
const router = express.Router();

const auth = require("../middlewares/auth");
const multer = require("../middlewares/multer");
const controller  = require('../controllers/sauce.controller');

router.get  ( "/", auth, controller.getAll );
router.post ( "/", auth, multer, controller.create );

router.get  ( "/:id", auth, controller.getOne );
router.put  ( "/:id", auth, multer, controller.updateSauce );
router.delete( "/:id", auth, multer, controller.remove );

router.post ( "/:id/like", auth, controller.like );

module.exports = router;