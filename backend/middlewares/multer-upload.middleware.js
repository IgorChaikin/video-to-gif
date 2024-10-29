const multer = require('multer');
const path = require('path');
const { v4: getUuidV4 } = require('uuid');
const { 
    FILE_INPUT_NAME, 
    VIDEO_FILE_PATH, 
    VIDEO_MIMETYPE_PREFIX, 
} = require('../constants');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, VIDEO_FILE_PATH);
    },
    filename: (req, file, cb) => {
        const {ext} = path.parse(file.originalname);
        const id = getUuidV4();
        cb(null, `${id}${ext}`);
    }
});
const fileFilter = (req, file, cb) => {
    if(file.mimetype.startsWith(VIDEO_MIMETYPE_PREFIX)){
        cb(null, true);
    }
    else{
        cb(null, false);
    }
 }
const upload = multer({storage, fileFilter});
const multerUploadMiddleware = upload.single(FILE_INPUT_NAME);

module.exports = { multerUploadMiddleware };