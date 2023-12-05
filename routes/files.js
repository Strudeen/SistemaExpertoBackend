const multer = require('multer');
const mongoose = require('mongoose');
const { GridFsStorage } = require('multer-gridfs-storage');
const Grid = require('gridfs-stream');
const crypto = require('crypto');
const { Router } = require('express');
const mongoURI = process.env.MONGODB_CNN;

const conn = mongoose.createConnection(mongoURI);

let gfs; let gridfsBucket;
conn.once('open', () => {
    gridfsBucket = new mongoose.mongo.GridFSBucket(conn.db, {
        bucketName: 'files'
    });

    gfs = Grid(conn.db, mongoose.mongo);
    gfs.collection('files');
})

const storage = new GridFsStorage({
    url: process.env.MONGODB_CNN,
    file: (req, file) => {
        return new Promise((resolve, reject) => {
            crypto.randomBytes(16, (err, buf) => {
                if (err) {
                    return reject(err);
                }
                const fileInfo = {
                    filename: file.originalname,
                    bucketName: 'files'
                };
                resolve(fileInfo);
            });
        });
    }
});

const upload = multer({ storage });
const router = Router();

router.post('/upload', upload.single('file'), (req, res) => { 
    return res.json({
        file: req.file,
        status: true,
        message: "El archivo ha sido registrado"
    });
});

router.get('/:id', async (req, res) => {

    const obj_id = new mongoose.Types.ObjectId(req.params.id);
    const files = await gridfsBucket.find({ "_id": obj_id }).toArray();
    if (files.length === 0) {
        return res.status(404).json({
            err: 'no files exists'
        });
    }

    const file = files[0];
    //check if image


    if (file.contentType === 'image/jpeg' || file.contentType
        === 'image/png') {
        const readStream = gridfsBucket.openDownloadStream(file._id);
        readStream.pipe(res);
    }
    else {
        return res.status(404).json({
            err: 'not an image'
        });
    }

});

module.exports = router;








