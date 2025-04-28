const express = require('express');
const router = express.Router();
const Hymn = require('../models/Hymn');

// 모든 성가 가져오기
router.get('/', async (req, res) => {
  try {
    const hymns = await Hymn.find();
    res.json(hymns);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 특정 타입의 성가 가져오기
router.get('/type/:type', async (req, res) => {
  try {
    const hymns = await Hymn.find({ type: req.params.type });
    res.json(hymns);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 성가 추가
router.post('/', async (req, res) => {
  const hymn = new Hymn({
    number: req.body.number,
    title: req.body.title,
    type: req.body.type
  });

  try {
    const newHymn = await hymn.save();
    res.status(201).json(newHymn);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// 성가 삭제
router.delete('/:id', async (req, res) => {
  try {
    await Hymn.findByIdAndDelete(req.params.id);
    res.json({ message: '성가가 삭제되었습니다' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router; 