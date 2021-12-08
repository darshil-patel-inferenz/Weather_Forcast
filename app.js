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
  res.send("Hello");
});
app.post("/postData", (req, res) => {
  const inputData = {
    Temperature: req.body.Temperature,
    Humidity: req.body.Humidity,
    TimeStamp: req.body.TimeStamp,
  };
  var request = require("request");
  var options = {
    method: "GET",
    url: "https://weather-anamoly-detetctor.herokuapp.com/",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      Temperature: inputData.Temperature,
      Humidity: inputData.Humidity,
    }),
  };
  request(options, function (error, response) {
    if (error) throw new Error(error);
    //console.log(response.body);
    const forSms = response.body.replace(/"/g, "").trim();

    if (inputData.Temperature > 30 || inputData.Humidity > 50 ) {

      console.log("Anamoly Detected");
      var request = require("request");
      var options = {
        method: "POST",
        url: "https://prod-13.northcentralus.logic.azure.com:443/workflows/d442f96a4a8f49ca95a53762506f4d80/triggers/manual/paths/invoke?api-version=2016-10-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=TOvQ4ufoW7_VUParW60B-F1PgB6I2pfEPbvO4zow9Bc",
        headers: {},
      };
      request(options, function (error, response) {
        if (error) throw new Error(error);
        console.log(response.body);
      });
      var options = {
        'method': 'GET',
        'url': 'https://iotforcast.herokuapp.com/alertMsg',
        'headers': {
        }
      };
      request(options, function (error, response) {
        if (error) throw new Error(error);
        console.log(response.body);
      });
      
    } else {
      console.log(forSms, "Not Detected");
    }
  });

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
  var sql = "SELECT * FROM Weather_Forcast ORDER BY Id DESC";

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
    message: "ALERT ! Anomaly Detected ",
    numbers: ["9824455339"],
  };
  fast2sms.sendMessage(options);
  res.json({msg:options.message,status:true});
});

module.exports = app;
