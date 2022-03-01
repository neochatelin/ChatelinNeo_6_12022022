const multer = require('multer');

const allowed_ext = {
    'image/jpg' : 'jpg',
    'image/jpeg' : 'jpg',
    'image/png' : 'png'
}
let index = 0;
const storage = multer.diskStorage(
    {
        destination : (req,res,cb) => {
            cb(null, 'images')
        },
        filename : (req,res,cb) => {
            const ext = allowed_ext[res.mimetype];
            cb(null, Date.now() + index + "." + ext);
            index++;
        }
    }
);

module.exports = multer({storage: storage}).single('image');