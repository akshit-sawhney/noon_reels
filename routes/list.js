if (process.env.NODE_ENV !== 'production') {
    require('dotenv').load();
}

const
    express = require('express')
    , router = express.Router()
    ;

const { getReels } = require('../controllers/noon_reels');

router.get('/', async (req, res, next) => {
    const reelsResponse = await getReels(String(req.query.user_id));
    return res.status(200).send(reelsResponse.resources);
});

module.exports = router;