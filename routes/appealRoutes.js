const express = require('express');
const router = express.Router();
const appealController = require('../controllers/appealController');

router.post('/', appealController.createAppeal);
router.put('/:id/work', appealController.takeToWork);
router.put('/:id/complete', appealController.completeAppeal);
router.put('/:id/cancel', appealController.cancelAppeal);
router.get('/', appealController.getAppeals);
router.put('/cancel-all-in-progress', appealController.cancelAllInProgress);

module.exports = router;