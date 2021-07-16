if (process.env.NODE_ENV !== 'production') {
    require('dotenv').load();
}

const
    express = require('express')
    , router = express.Router()
    ;

const { createNotebook, getNoteBooksByUserId, getNotebooksByNameAndUserId } = require('../controllers/notebooks');
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

router.get('/search', async (req, res, next) => {
    const notebookName = String(req.query.notebook_name);
    const notebooksListResponse = await getNotebooksByNameAndUserId(String(req.query.user_id), notebookName);
    return res.status(200).send(notebooksListResponse.resources);
});

module.exports = router;