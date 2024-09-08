const express = require('express');
const {
  uploadQAPair,
  getQAPairs,
  updateQAPair,
  deleteQAPair,
} = require('../controllers/knowledgeBaseController');
const authenticate = require('../middlewares/authMiddleware')

const router = express.Router();

router.post('/upload', authenticate, uploadQAPair);

router.get('/', authenticate, getQAPairs);

router.put('/:id', authenticate, updateQAPair);

router.delete('/:id', authenticate, deleteQAPair);

module.exports = router;
