const { cloudinary } = require("../cloudinary");

const uploadFiles = async (req, res, next) => {
    try {
        const posterFile = req.files.poster ? req.files.poster[0] : null;
        const videoFile = req.files.video ? req.files.video[0] : null;

        let posterUpload, videoUpload;

        if (posterFile) {
            posterUpload = await new Promise((resolve, reject) => {
                const uploadStream = cloudinary.uploader.upload_stream(
                    { resource_type: 'image', folder: 'Posters' },
                    (error, result) => {
                        if (error) reject(error);
                        else resolve(result);
                    }
                );
                uploadStream.end(posterFile.buffer);
            });
        }

        if (videoFile) {
            videoUpload = await new Promise((resolve, reject) => {
                const uploadStream = cloudinary.uploader.upload_stream(
                    { resource_type: 'video', folder: 'Videos' },
                    (error, result) => {
                        if (error) reject(error);
                        else resolve(result);
                    }
                );
                uploadStream.end(videoFile.buffer);
            });
        }
        req.uploadedFiles = { posterUpload, videoUpload };
        next();
    } catch (err) {
        next(err);  // Pass the error to the error handler middleware
    }
};

module.exports = uploadFiles;
