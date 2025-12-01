const express = require('express');
const router = express.Router();
const adminController = require('../controller/adminController.js'); // adjust path if needed



router.post('/', adminController.create);
router.get('/', adminController.getAll);
router.get('/:id', adminController.getById);
router.put('/:id', adminController.update);
router.delete('/:id', adminController.remove);



module.exports = router;
