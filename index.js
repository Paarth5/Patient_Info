const { log } = require("console");
const express = require("express");
const mongoose = require("mongoose");
const Patient = require("./models/user.js");
const path = require("path");
const app = express();
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

mongoose
  .connect("mongodb://127.0.0.1:27017/patients")
  .then(() => {
    console.log("Connected to mongo!!");
  })
  .catch((err) => {
    console.log("Error in connecting to Mongo", err);
  });

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.redirect("/login");
});
app.get("/login", (req, res) => {
  res.render("login");
});
app.get("/signup", (req, res) => {
  res.render("signup");
});
app.post("/signup", async (req, res) => {
  const { user } = req.body;
  const newPatient = new Patient(user);
  await newPatient.save();
  res.redirect("/login");
});
app.post("/home", async (req, res) => {
  const { user } = req.body;
  const patients = await Patient.find({ username: user.username });
  let reqPatient;
  for (person of patients) {
    if (person.password === user.password) {
      reqPatient = person;
      break;
    }
  }
  if (reqPatient) res.render("home", { reqPatient });
  else {
    res.redirect("/login");
  }
});

app.listen(3000, () => {
  console.log("Listening on Port 3000!");
});
