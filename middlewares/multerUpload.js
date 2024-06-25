const multer = require("multer");
const path = require('path');
const fs = require('fs');


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'documents/');
       
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
 
    }
});

const upload = multer({ //multer settings
    storage: storage,
    fileFilter: function (req, file, callback) {
        var ext = path.extname(file.originalname);
        console.log(file);

        if (ext !== '.png' && ext !== '.jpg' && ext !== '.jpeg') {
            return callback(new Error('Only images are allowed'))
        }
        
        callback(null, true)
    },
    // limits:{
    //     fileSize: 1024 * 1024
    // }
});


module.exports = upload;