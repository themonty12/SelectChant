const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const hymnRoutes = require("./routes/hymns");

const app = express();
const port = process.env.PORT || 3000;

// 미들웨어 설정
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "../views"));
app.use(express.static(path.join(__dirname, "../public")));
app.use(bodyParser.json());

// 라우트 설정
app.use("/", hymnRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
