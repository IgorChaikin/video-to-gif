const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { multerUploadMiddleware } = require('./middlewares/multer-upload.middleware');
const { videoValidatorMiddleware } = require('./middlewares/video-validator.middleware');
const { uploadRouter } = require('./routers/upload.router')

const app = express();

app.use(cors());
app.use(express.json());
app.use('/upload', multerUploadMiddleware);
app.use('/upload', videoValidatorMiddleware);
app.use('/upload', uploadRouter);

const port = process.env.API_PORT;

app.listen(port, () => {
    console.log(`Server started on http://localhost:${port}`);
});