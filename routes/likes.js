if (process.env.NODE_ENV !== 'production') {
    require('dotenv').load();
}

const
    express = require('express')
    , router = express.Router()
    ;
const { updateLikesByReelId } = require('../controllers/noon_reels');
router.post('/update_likes', async (req, res, next) => {
    const updateResponse  = updateLikesByReelId(req.body.reel_id, req.body.likes);
    return res.status(200).send({
        message: "Likes Updated"
    });
});

module.exports = router;