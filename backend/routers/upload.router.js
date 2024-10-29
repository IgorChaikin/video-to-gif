const express = require('express');
const ffmpeg = require('fluent-ffmpeg');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const {  
    GIF_FILE_PATH, 
    GIF_ALG,
} = require('../constants');

const uploadRouter = express.Router();

uploadRouter.post('/', async (req, res) => {
    const videoPath = req.file.path;
    const  { name: videoName } = path.parse(videoPath);
    const gifPath = path.join(GIF_FILE_PATH, `${videoName}.gif`);

    try {
        ffmpeg(videoPath)
        .output(gifPath)
        .videoFilters(`fps=${process.env.GIF_FPS},scale=${process.env.GIF_SCALE}:flags=${GIF_ALG}`)
        .on('end', () => {
            fs.unlinkSync(videoPath);
            return res.download(gifPath, (err) => {
                if (err) 
                    return res.status(500).send('Error downloading file');
                fs.unlinkSync(gifPath);
            });
        })
        .on('error', (err) => {
            console.error(err);
            fs.unlink(gifPath);
            return res.status(500).send('Conversion failed');
        })
        .run();
    } catch(error) {
        return res.status(500).send('Internal server error');
    }
});

module.exports = { uploadRouter };