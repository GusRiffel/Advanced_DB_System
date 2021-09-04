const express = require("express");
const path = require("path");
const app = express();
const port = 3000;
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.render("index");
});

app.get("/contact", (req, res) => {
  res.render("contact");
});

app.get("/about", (req, res) => {
  res.render("about");
});

app.get("/services", (req, res) => {
  res.render("services");
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost${port}`);
});