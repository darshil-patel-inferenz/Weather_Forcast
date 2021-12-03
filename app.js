const express = require("express");
const app = express();
var mysql = require("mysql");
const db = require("./config/database");
const pool = require("./config/database");
const fast2sms = require("fast-two-sms");

var cors = require("cors");
app.use(cors());
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
  next();
});
app.use(express.json());
app.use(express.urlencoded({ extended: false, limit: "20mb" }));

app.get("/", (req, res) => {
  res.send("aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa");
});
app.post("/postData", (req, res) => {
  const inputData = {
    Temperature: req.body.Temperature,
    Humidity: req.body.Humidity,
    TimeStamp:req.body.TimeStamp
  };

  var sql = "INSERT INTO Weather_Forcast SET ?";

  pool.getConnection((err, connection) => {
    if (err) throw err;

    connection.query(sql, inputData, function (err, result) {
      if (err) {
        res.json({ status: false, message: "Failed" + " " + err });
      } else {
        res.status(201).json({ status: true, messgae: result });
      }
    });
  });
});
app.get("/getData", (req, res) => {
  var sql = "SELECT * FROM Weather_Forcast";

  pool.getConnection((err, connection) => {
    if (err) throw err;

    connection.query(sql, function (err, data) {
      if (err) throw err;
      if (data.length > 1) {
        res.status(200).json({ message: data, status: true });
      } else {
        res.status(400).json({ message: "No Data Found", status: false });
      }
    });
  });
});

app.get("/getLastEntry", (req, res) => {
  var sql = "SELECT * FROM Weather_Forcast ORDER BY Id DESC LIMIT 1;";

  pool.getConnection((err, connection) => {
    if (err) throw err;

    connection.query(sql, function (err, data) {
      if (err) throw err;
      if (data.length > 0) {
        res.status(200).json({ message: data, status: true });
      } else {
        res.status(400).json({ message: "No Data Found", status: false });
      }
    });
  });
});
app.get("/alertMsg", (req, res) => {
  var options = {
    authorization: process.env.OTP_KEY,
    message: "ALERT ! High Temperature Detected ",
    numbers: ["9824455339"],
  };
  fast2sms.sendMessage(options);
  res.json(message)
});

module.exports = app;
