const { S3Client, PutObjectCommand, GetObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');

const s3Client = new S3Client({
    region: 'auto',
    endpoint: process.env.CLOUDFLARE_ENDPOINT,
    credentials: {
        accessKeyId: process.env.CLOUDFLARE_ACCESS_KEY_ID,
        secretAccessKey: process.env.CLOUDFLARE_SECRET_ACCESS_KEY,
    },
    forcePathStyle: true,
});

// Upload file to R2
const uploadToR2 = async (buffer, fileName, mimeType) => {
    const params = {
        Bucket: process.env.CLOUDFLARE_BUCKET_NAME,
        Key: fileName,
        Body: buffer,
        ContentType: mimeType, // Set the MIME type of the file (e.g., 'image/webp')
    };

    const command = new PutObjectCommand(params);
    await s3Client.send(command);

    // Return the URL without signing (if the object is public)
    return `${process.env.CLOUDFLARE_ENDPOINT}/${process.env.CLOUDFLARE_BUCKET_NAME}/${fileName}`;
};

// Get a signed URL to access the file securely
const getPresignedUrl = async (fileName) => {
    const command = new GetObjectCommand({
        Bucket: process.env.CLOUDFLARE_BUCKET_NAME,
        Key: fileName,
    });

    // Generate a signed URL that expires in 1 hour
    const signedUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
    return signedUrl;
};

module.exports = { uploadToR2, getPresignedUrl };
