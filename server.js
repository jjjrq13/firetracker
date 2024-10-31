
// ------------- PACKAGES -------------
const express = require("express");
const app = express();



app.get("/", async (req, res) => {
    res.render("index.ejs");
  });

  app.get("/home", async (req, res) => {
    res.render("index.ejs");
  });

  app.get("/about", async (req, res) => {
    res.render("about.ejs");
  });

  app.get("/contact", async (req, res) => {
    res.render("contact.ejs");
  });

app.listen(3000, () => {
    console.log("Listening on port 3000");
  });
  