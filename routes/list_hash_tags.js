if (process.env.NODE_ENV !== 'production') {
    require('dotenv').load();
}

const
    express = require('express')
    , router = express.Router()
    ;

const { getPostsByHashtag } = require('../controllers/noon_hash_tags');
const { getReelsByIds } = require('../controllers/noon_reels');

router.get('/', async (req, res, next) => {
    const reelsResponse = await getPostsByHashtag(String(req.query.hashtag));
    const idsList = [];
    reelsResponse.resources.forEach(individualReelResponse => {
        idsList.push(individualReelResponse.post_id);
    });
    if (idsList.length) {
        const finalResponse = await getReelsByIds(idsList);
        return res.status(200).send(finalResponse.resources);
    } else {
        return res.status(200).send([]);
    }
});

module.exports = router;