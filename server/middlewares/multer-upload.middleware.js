const multer = require('multer');
const { v4: getUuidV4 } = require('uuid');
const { 
    FILE_INPUT_NAME, 
    VIDEO_FILE_PATH, 
    VIDEO_MIMETYPE_PREFIX, 
} = require('../constants');

const storage = {
    destination: (req, file, cb) => {
        cb(null, VIDEO_FILE_PATH);
    },
    filename: (req, file, cb) => {
        const {name, ext} = path.parse(req.file.filename);
        const suffix = getUuidV4();
        cb(null, `${name}_${suffix}.${ext}`);
    }
};
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