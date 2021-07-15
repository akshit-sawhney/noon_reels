if (process.env.NODE_ENV !== 'production') {
    require('dotenv').load();
}

const
    express = require('express')
    , router = express.Router()
    ;

const { createNotebook } = require('../controllers/notebooks');
router.post('/create', async (req, res, next) => {
    const createNotebookResponse = await createNotebook(req.body);
    return res.status(200).send({
        message: "notebook Created"
    });
});

module.exports = router;