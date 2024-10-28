const express = require('express');
const ffmpeg = require('fluent-ffmpeg');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const {  
    GIF_FILE_PATH, 
    GIF_ALG,
} = require('../constants');

/*
    const ffmpeg = createFFmpeg({ log: true });
    if (!ffmpeg.isLoaded()) {
        await ffmpeg.load();
    }
    await ffmpeg.writeFile(videoFullName, await fetchFile(videoPath));
    await ffmpeg.exec(
        '-i', 
        videoFullName, 
        '-vf', 
        `fps=${process.env.GIF_FPS},scale=${process.env.GIF_SCALE}:flags=${GIF_ALG}`, 
        '-c:v', 
        'gif', 
        gifFullName
    );
    await fs.promises.writeFile(gifPath, await ffmpeg.readFile(gifFullName));

    res.download(gifPath, (err) => {
        if (err) {
            console.error(err);
        }
        fs.unlink(videoPath, () => {});
        fs.unlink(gifPath, () => {});
    });*/

const uploadRouter = express.Router();

uploadRouter.post('/', async (req, res) => {
    const videoPath = req.file.path;
    const  { name: videoName } = path.parse(videoPath);
    const gifPath = path.join(GIF_FILE_PATH, `${videoName}.gif`);

    ffmpeg(videoPath)
        .output(gifPath)
        .videoFilters(`fps=${process.env.GIF_FPS},scale=${process.env.GIF_SCALE}:flags=${GIF_ALG}`)
        .on('end', () => {
            return res.download(gifPath, (err) => {
                if (err) {
                    return res.status(500).send('Error downloading file');
                }

                /*[videoPath, gifPath].forEach((path) => {
                    fs.unlink(path, (err) => {
                        if (err) {
                            return res.status(500).send('Error deleting file');
                        }
                    });
                });*/
            });
        })
        .on('error', (err) => {
            console.error(err);
            return res.status(500).send('Conversion failed');
        })
        .run();
});

module.exports = { uploadRouter };