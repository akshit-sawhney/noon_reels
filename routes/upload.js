if (process.env.NODE_ENV !== 'production') {
    require('dotenv').load();
}
const moment = require('moment');

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

const { createHashTagEntry } = require('../controllers/noon_hash_tags');

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

    blobService.createBlockBlobFromStream(containerName, blobName, stream, streamLength, (err, response) => {

        if(err) {
            handleError(err);
            return;
        }

        const currentTimeStamp = moment().valueOf();

        const newItem = {
            user_id: req.body.user_id,
            path: `${process.env.AZURE_STORAGE_URI_SUFFIX}/${containerName}/${blobName}`,
            views: 0,
            likes: 0,
            created_at: currentTimeStamp,
            updated_at: currentTimeStamp
          };

          createNoonReel(newItem)
            .then(createNoonReelResponse => {
                if (createNoonReelResponse && createNoonReelResponse.resource && createNoonReelResponse.resource.id) {
                    const hastagItem = {
                    hashtag: req.body.hash_tag,
                    post_id: createNoonReelResponse.resource.id,
                    created_at: currentTimeStamp,
                    updated_at: currentTimeStamp
                  };
                createHashTagEntry(hastagItem);
                }
            })
            .catch(err => {

            });

        res.render('success', { 
            message: 'File uploaded to Azure.' 
        });
    });
});

module.exports = router;