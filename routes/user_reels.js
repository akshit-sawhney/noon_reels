if (process.env.NODE_ENV !== 'production') {
    require('dotenv').load();
}

const
    express = require('express')
    , router = express.Router()
    ;

    const { createUserReel } = require('../controllers/user_reels');

router.post('/create', async (req, res, next) => {
    const createUserReelResponse = await createUserReel(req.body);
    return res.status(200).send({
        message: "Note Saved"
    });
});

module.exports = router;
