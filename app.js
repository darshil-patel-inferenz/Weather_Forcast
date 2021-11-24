const express = require("express");
const app = express();
var mysql = require("mysql");
//const pet = require("./routes/pet")
const pool = require("./config/database");
const multer = require("multer");

var cors = require("cors");
app.use(cors());
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
  next();
});
app.use(express.json());
app.use(express.urlencoded({ extended: false, limit: "20mb" }));
//app.use(express.static(path.join(__dirname, "public")));
// var con = mysql.createConnection({
//   host:'remotemysql.com',
//   user:'Em6vInuMcj',
//   password:'KdcgjxoZzh',
//   database:'Em6vInuMcj'
// });

// con.connect(function(err) {
//   if(err){
//       throw err;
//   }
//   console.log('connected to mysql db')
// });
app.get("/", (req, res) => {
  res.send("aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa");
});
app.get("/getPets", (req, res) => {
  var sql = "SELECT * FROM pets";

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
app.get("/getBreed/:id", (req, res) => {
  var id = req.params.id;
  console.log(id);

  pool.getConnection((err, connection) => {
    if (err) throw err;

    var sql = "SELECT * FROM pet_breeds WHERE Pet_Id = ? ";
    connection.query(sql, [id], function (err, data) {
      if (err) throw err;
      if (data.length > 1) {
        res.status(200).json({ message: data, status: true });
      } else {
        res.status(400).json({ message: "No Data Found", status: false });
      }
    });
  });
});
app.get("/pet/:id", (req, res) => {
  const D_id = req.params.id;
  var sql = "SELECT * FROM pet_breeds WHERE Breed_id = ?";

  pool.getConnection((err, connection) => {
    if (err) throw err;

    var sql = "SELECT * FROM pet_breeds WHERE Pet_Id = ? ";
    connection.query(sql, [D_id], function (err, data) {
      console.log(D_id);
      if (err) throw err;
      if (data.length > 0) {
        res.status(200).json({ message: data, status: true });
      } else {
        res.status(400).json({ message: "No Data Found", status: false });
      }
    });
  });
});

app.get("/pet/image/:path", (req, res) => {
  res.download("./public/images/pet_images/" + req.params.path);
});

app.get("/petdata/:id", (req, res) => {
  const p_id = req.params.id;

  pool.getConnection((err, connection) => {
    if (err) throw err;

    var sql = "SELECT * FROM pet_breeds WHERE Breed_id = ?";
    connection.query(sql, [p_id], function (err, data) {
      console.log(p_id);
      if (err) throw err;
      console.log(data);
      if (data.length > 0) {
        // const dataJ = JSON.parse(data);
        res.status(200).json({ message: data, status: true });
      } else {
        res.status(400).json({ message: "No Data Found", status: false });
      }
    });
  });
});

module.exports = app;
