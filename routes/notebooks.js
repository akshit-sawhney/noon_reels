if (process.env.NODE_ENV !== 'production') {
    require('dotenv').load();
}

const
    express = require('express')
    , router = express.Router()
    ;

const { createNotebook, getNoteBooksByUserId } = require('../controllers/notebooks');
router.post('/create', async (req, res, next) => {
    const createNotebookResponse = await createNotebook(req.body);
    return res.status(200).send({
        message: "notebook Created"
    });
});

router.get('/list', async (req, res, next) => {
    const notebooksListResponse = await getNoteBooksByUserId(String(req.query.user_id));
    return res.status(200).send(notebooksListResponse.resources);
});

module.exports = router;