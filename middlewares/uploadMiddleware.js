let fileUploadMiddleware = {
    images: ['jpg', 'jpeg', 'png'],
    videos: ['mp4', 'mkv'],
    fileSizeLimit: 50*1024*1024,
    'allowOnly': function(req, res, next, options=[]) {

    }
}

module.exports = fileUploadMiddleware