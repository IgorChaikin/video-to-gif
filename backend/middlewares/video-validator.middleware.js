const ffmpeg = require('fluent-ffmpeg');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const { VIDEO_FILE_PATH } = require('../constants');

const videoValidatorMiddleware = (req, res, next) => {
    if (!req.file) {
        return res.status(422).send('No file uploaded');
    }

    const filePath = path.join(VIDEO_FILE_PATH, req.file.filename);

    try {
        ffmpeg.ffprobe(path.join(__dirname, '..', filePath), (err, metadata) => {
            if (err) {
                fs.unlinkSync(filePath);
                return res.status(500).send('Error processing video');
            }
            
            const { width, height } = metadata.streams[0];
            const duration = metadata.format.duration;
            
            if (
                width > process.env.MAX_VIDEO_WIDTH || 
                height > process.env.MAX_VIDEO_HEGHT || 
                duration > process.env.MAX_VIDEO_LENGTH
            ) {
                fs.unlinkSync(filePath);
                return res.status(422).send('Video does not meet the required resolution or length');
            } else {
                next();
            }
        });
    } catch(error) {
        return res.status(500).send('Internal server error');
    }
};

module.exports = { videoValidatorMiddleware };