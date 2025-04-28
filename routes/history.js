const express = require('express');
const router = express.Router();
const History = require('../models/History');

// 모든 히스토리 가져오기
router.get('/', async (req, res) => {
  try {
    const history = await History.find().sort({ date: -1 }).limit(10);
    res.json(history);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 히스토리 추가
router.post('/', async (req, res) => {
  const history = new History({
    hymns: req.body.hymns
  });

  try {
    const newHistory = await history.save();
    res.status(201).json(newHistory);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// 히스토리 삭제
router.delete('/:id', async (req, res) => {
  try {
    await History.findByIdAndDelete(req.params.id);
    res.json({ message: '히스토리가 삭제되었습니다' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router; 