const path = require('path');
require('dotenv').config();

const BASE_FILE_PATH = './uploads';

const FILE_INPUT_NAME = 'file';
const GIF_FILE_PATH = path.join(BASE_FILE_PATH, 'gif');
const GIF_ALG = 'lanczos';
const VIDEO_FILE_PATH = path.join(BASE_FILE_PATH, 'video');
const VIDEO_MIMETYPE_PREFIX = 'video/';

module.exports = {
    FILE_INPUT_NAME,
    GIF_FILE_PATH,
    GIF_ALG,
    VIDEO_FILE_PATH,
    VIDEO_MIMETYPE_PREFIX,
}