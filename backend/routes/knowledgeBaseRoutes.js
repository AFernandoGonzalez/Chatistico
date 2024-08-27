const express = require('express');
const {
  uploadQAPair,
  getQAPairs,
  updateQAPair,
  deleteQAPair,
} = require('../controllers/knowledgeBaseController');

const router = express.Router();

router.post('/upload', uploadQAPair);

router.get('/', getQAPairs);

router.put('/:id', updateQAPair);

router.delete('/:id', deleteQAPair);

module.exports = router;
