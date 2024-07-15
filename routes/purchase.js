const express = require('express');
const purchaseController = require('../controllers/purchase');
const authenticationMiddleware = require('../middleware/authenticate');

const router = express.Router();

router.get('/purchase/premiumMembership', authenticationMiddleware.authenticate, purchaseController.purchasePremium);
router.post('/purchase/updateTransactionStatus', authenticationMiddleware.authenticate, purchaseController.updateTransactionStatus);

module.exports = router;