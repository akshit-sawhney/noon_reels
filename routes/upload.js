if (process.env.NODE_ENV !== 'production') {
    require('dotenv').load();
}

const
      express = require('express')
    , router = express.Router()

    , multer = require('multer')
    , inMemoryStorage = multer.memoryStorage()
    , uploadStrategy = multer({ storage: inMemoryStorage }).single('image')

    , azureStorage = require('azure-storage')
    , blobService = azureStorage.createBlobService()

    , getStream = require('into-stream')
    , containerName = 'images'
;

const { createNoonReel } = require('../controllers/noon_reels');

const handleError = (err, res) => {
    res.status(500);
    res.render('error', { error: err });
};

const getBlobName = originalName => {
    const identifier = Math.random().toString().replace(/0\./, ''); // remove "0." from start of string
    return `${identifier}-${originalName}`;
};

router.post('/', uploadStrategy, (req, res) => {
    console.log(req.body)

    const
          blobName = getBlobName(req.file.originalname)
        , stream = getStream(req.file.buffer)
        , streamLength = req.file.buffer.length
    ;

    console.log('name is: ', blobName, containerName);

    blobService.createBlockBlobFromStream(containerName, blobName, stream, streamLength, (err, response) => {

        if(err) {
            handleError(err);
            return;
        }

        const newItem = {
            user_id: req.body.user_id,
            path: `${process.env.AZURE_STORAGE_URI_SUFFIX}/${containerName}/${blobName}`,
            views: 0,
            likes: 0
          };

        createNoonReel(newItem);

        res.render('success', { 
            message: 'File uploaded to Azure.' 
        });
    });
});

module.exports = router;