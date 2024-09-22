const multer = require('multer');
const { uploadToR2, getPresignedUrl } = require('../config/r2Uploader'); // Importing the required functions

// Setup multer storage to store files in memory
const storage = multer.memoryStorage();
const upload = multer({ storage });

/**
 * Middleware to handle file uploads via Multer
 */
const fileUploadMiddleware = upload.fields([
    { name: 'bot_icon_image', maxCount: 1 },
    { name: 'chat_icon_image', maxCount: 1 }
]);

/**
 * Function to process file uploads and upload to Cloudflare R2.
 * It returns the URLs of uploaded files.
 */
const processFileUploads = async (files) => {
    const result = {};

    if (files?.bot_icon_image) {
        const botIconFile = files.bot_icon_image[0];
        // Upload the bot icon image to R2 and get the URL
        const botIconUrl = await uploadToR2(botIconFile.buffer, botIconFile.originalname, botIconFile.mimetype);
        // Optionally, get a presigned URL for secure access
        const botIconPresignedUrl = await getPresignedUrl(botIconFile.originalname);
        result.bot_icon_image = botIconPresignedUrl;
    }

    if (files?.chat_icon_image) {
        const chatIconFile = files.chat_icon_image[0];
        // Upload the chat icon image to R2 and get the URL
        const chatIconUrl = await uploadToR2(chatIconFile.buffer, chatIconFile.originalname, chatIconFile.mimetype);
        // Optionally, get a presigned URL for secure access
        const chatIconPresignedUrl = await getPresignedUrl(chatIconFile.originalname);
        result.chat_icon_image = chatIconPresignedUrl;
    }

    return result;
};

module.exports = {
    fileUploadMiddleware,
    processFileUploads
};
