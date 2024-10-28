const express = require('express');
const { createFFmpeg, fetchFile } = require('@ffmpeg/ffmpeg');
const path = require('path');
const fs = require('fs');

const { 
    GIF_FILE_EXT, 
    GIF_FILE_PATH, 
    GIF_ALG,
} = require('./constants');

const { multerUploadMiddleware } = require('./middlewares/multer-upload.middleware');
const { videoValidatorMiddleware } = require('./middlewares/video-validator.middleware');

const app = express();
const ffmpeg = createFFmpeg({ log: true });

//async function createApp() {  
//}

app.use('/upload', multerUploadMiddleware);
app.use('/upload', videoValidatorMiddleware);

app.post('/upload', async (req, res) => {
    if (!ffmpeg.isLoaded()) {
        await ffmpeg.load();
    }

    const videoPath = req.file.path;
    const  {name: videoName, base: videoFullName} = path.parse(videoPath);
    const gifFullName = `${videoName}.${GIF_FILE_EXT}`
    const gifPath = path.join(GIF_FILE_PATH, gifFullName);

    await ffmpeg.writeFile(videoFullName, await fetchFile(videoPath));
    await ffmpeg.exec(
        '-i', 
        videoFullName, 
        '-vf', 
        `fps=${process.env.GIF_FPS},scale=${process.env.GIF_SCALE}:flags=${GIF_ALG}`, 
        '-c:v', 
        GIF_FILE_EXT, 
        gifFullName
    );
    await fs.promises.writeFile(gifPath, await ffmpeg.readFile(gifFullName));

    res.download(gifPath, (err) => {
        if (err) {
            console.error(err);
        }
        fs.unlink(videoPath, () => {});
        fs.unlink(gifPath, () => {});
    });
});

const PORT = process.env.PORT;

app.listen(PORT, () => {
    console.log(`Server started on http://localhost:${PORT}`);
});