const express = require("express");
const app = express();
const port = 3000;
app.set("view engine", "ejs");

app.get("/", (req, res) => {
  res.render("index");
});

app.get("/review", (req, res) => {
  res.render("review");
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost${port}`);
});