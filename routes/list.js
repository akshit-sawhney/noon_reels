if (process.env.NODE_ENV !== 'production') {
    require('dotenv').load();
}

const
    express = require('express')
    , router = express.Router()
    ;

const { getReels, getReelsByIds } = require('../controllers/noon_reels');
const { getReelsByNotebookId } = require('../controllers/user_reels');

router.get('/', async (req, res, next) => {
    const reelsResponse = await getReels(String(req.query.user_id));
    return res.status(200).send(reelsResponse.resources);
});

router.get('/reels_by_notebook', async (req, res, next) => {
    const reelsResponse = await getReelsByNotebookId(String(req.query.notebook_id));
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