const express = require("express");
const router = express.Router();
const db = require("../database/db");
const Hymn = require("../models/Hymn");

// 메인 페이지
router.get("/", (req, res) => {
  res.render("index");
});

// 랜덤 성가 선택
router.post("/api/random-hymns", async (req, res) => {
  try {
    const { selectedHymns = [] } = req.body;
    const excludeNumbers = selectedHymns.map((h) => h.number);
    const fourWeeksAgo = new Date();
    fourWeeksAgo.setDate(fourWeeksAgo.getDate() - 28);

    const result = {
      entrance: await Hymn.getRandomByType(
        "입당",
        1,
        excludeNumbers,
        fourWeeksAgo
      ),
      offering: await Hymn.getRandomByType(
        "봉헌",
        2,
        excludeNumbers,
        fourWeeksAgo
      ),
      communion: await Hymn.getRandomByType(
        "성체",
        2,
        excludeNumbers,
        fourWeeksAgo
      ),
      closing: await Hymn.getRandomByType(
        "파견",
        1,
        excludeNumbers,
        fourWeeksAgo
      ),
    };

    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
