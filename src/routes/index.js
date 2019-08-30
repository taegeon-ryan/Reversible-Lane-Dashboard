const { Router } = require('express');
var mysql = require('mysql');
const session = require('express-session');
var crypto = require('crypto');
var MySQLStore = require('express-mysql-session')(session);
var dbconfig = require('../config/dbconfig');
var db = mysql.createConnection(dbconfig);
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');

const router = Router();

db.connect((err)=>{
  if(err){
    console.log(err);
  }
  else{
    console.log("success");
  }
});

/* GET index page. */
router.get('/', (req, res) => {
  res.render('index', {
    title: 'Express'
  });
});

router.get('/test', (req, res)=> {
  var selectsql = 'SELECT * FROM `signal_data` ORDER BY idx DESC';
  db.query(selectsql, function (error, results) {
    if (error) {
      status = "err";
      console.log("err");
    }
    else  {
      if(!results[0]){
        console.log("no");
      }else{
        console.log(results);
      }
    }
    res.render('index',{
      title: 'Express'
    });
  });
});

router.post('/upload_live',(req, res)=>{
  
});

router.post('/upload_signal', (req, res) =>{

});

var traffic = [0,0,0];
var test_x = 1;
var test_y = 2;

setTimeout(() => {
  var insertsql = 'INSERT INTO traffic (traffic_x, traffic_y) VALUES (? , ?)';

  db.query(insertsql,[test_x, test_y] ,function (error, results) {
    if (error) {
      status = "err";
      console.log("err");
    }
    else  {
      console.log("insert success");
    }
  });
  test_x = test_x + 1;
  test_y = test_y + 2;
}, 1000);

setTimeout(() => {
  var clearsql = 'DELETE FROM traffic';
  db.query(clearsql, function (error, results) {
    if (error) {
      status = "err";
      console.log("err");
    }
    else  {
      if(!results[0]){
        console.log("no");
      }else{
        console.log(results);
      }
    }
  });
}, 60000);


module.exports = router;
