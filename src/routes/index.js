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
        var traffic_data = results[0].input_data;
        var selectsql = 'SELECT * FROM `traffic_data` ORDER BY idx DESC';
        db.query(selectsql, function(error, results){
          if(error){
            status = "err";
            console.log("err");
          }else{
            var signal_data = results[0].input_data;
            res.render('edit', {traffic : signal_data, signal: traffic_data , algo_data : algo_data});
          }
        });
      }
    }
  });
});

router.get('/edit', (req, res) =>{
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
        var traffic_data = results[0].input_data;
        var selectsql = 'SELECT * FROM `traffic_data` ORDER BY idx DESC';
        db.query(selectsql, function(error, results){
          if(error){
            status = "err";
            console.log("err");
          }else{
            var signal_data = results[0].input_data;
            res.render('home', {traffic : signal_data, signal: traffic_data , algo_data : algo_data});
          }
        });
      }
    }
  });
});

router.post('/upload_traffic',(req, res)=>{
  if(req.body.traffic){
    var insertsql = 'INSERT INTO traffic_data (traffic_data) VALUES (?)';

    db.query(insertsql, [req.body.traffic], (error, results)=>{
      if (error) {
        status = "err";
        console.log("ARDUINO traffic err");
        res.send({code : 4});
      }
      else  {
        console.log("ARDUINO traffic success");
        res.send({code : 1});
      }
    });
  }else {
    res.send({code : 2});
  }
});

router.post('/upload_signal', (req, res)=>{
  if(req.body.signal){
    var insertsql = 'INSERT INTO signal_data (input_data) VALUES (?)';

    db.query(insertsql, [req.body.signal], (error, results)=>{
      if (error) {
        status = "err";
        console.log("ARDUINO signal err");
        res.send({code : 4});
      }
      else  {
        console.log("ARDUINO signal success");
        res.send({code : 1});
      }
    });
  }else {
    res.send({code : 2});
  }
});

router.post('/upload_live', (req, res) =>{
  var insertsql = 'INSERT INTO traffic (traffic_x, traffic_y) VALUES (? , ?)';
  db.query(insertsql,[req.body.x, req.body.y] ,function (error, results) {
    if (error) {
      status = "err";
      console.log("err");
      res.send({code : 4});
    }
    else  {
      console.log("insert success");
      res.send({code : 1});
    }
  });
});

router.get('/download_traffic',(req, res)=>{
    var selectsql = 'SELECT * FROM traffic_data LIMIT 1';
    db.query(selectsql, (error, results)=>{
      if (error) {
        res.send({code : 4});
      }
      else  {
        console.log(results);
        console.log(results[0]);
        var send_data = results[0].input_data;
        res.send("TWICE"+send_data);
      }
    });
});

var selectsql = 'SELECT * FROM traffic_data LIMIT 1';
db.query(selectsql, (error, results)=>{
  if (error) {
    res.send({code : 4});
  }
  else  {
    console.log(results);
    console.log(results[0]);
  }
});

router.post('/upload_signal', (req, res)=>{
  if(req.body.signal){
    var selectsql = 'SELECT * FROM traffic_data LIMIT 1';

    db.query(insertsql, [req.body.signal], (error, results)=>{
      if (error) {
        status = "err";
        console.log("ARDUINO signal err");
        res.send({code : 4});
      }
      else  {
        console.log("ARDUINO signal success");
        res.send({code : 1});
      }
    });
  }else {
    res.send({code : 2});
  }
});

var count = 0;
var traffic_normal = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
var traffic_simple = [0,0];
var status_normal = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
var algo_data;
var status_badak = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
var status_flag = [0,0,0];

var now_status = setInterval(()=>{
  var selectsql = 'SELECT * FROM signal_data ORDER BY idx DESC LIMIT 1';
  var traffic_data_selectsql = 'SELECT * FROM traffic_data ORDER BY idx DESC LIMIT 1';
  db.query(selectsql, (error, results)=>{
    if(error) {
      console.log("error");
    }else {
      if(!results[0]){
        console.log("수집된 데이터가 없습니다.");
      }else{
        var i = 0;
        var result_array = results[0].input_data.split('');
        for(i = 0; i < 21; i++){
          status_normal[i] = result_array[i];
        }
        console.log("now status loaded");
      }
    }
  }
  );
  db.query(traffic_data_selectsql, (error, results)=>{
       if(error){
         console.log("error");
       }else{
          var i = 0;
          var result_array = results[0].input_data.split('');
          for(i = 0; i < 21; i++){
            status_badak = result_array[i];
          }
          console.log("badak now status loaded");
       }
  });
}, 500);

var algo = setInterval(()=>{
  algo_data = -1;
  var check = 2015;
  if(traffic_simple[0] - 10 > traffic_simple[1]){
    check = 0;
    while(check < 3){
      if(status_flag[check] == 1){
        check++;
      }else if(status_flag[check] == 0){
        algo_data = 0;
      }else{
        algo_data = 10+check;
      }
    }
  }else if(traffic_simple[1] - 10 > traffic_simple[0]){
    check = 2;
    while(check >= 0){
      if(status_flag[check] == 2){
        check--;
      }else if(status_flag[check] == 0){
        algo_data = 0;
      }else{
        algo_data = 20+check;
      }
    }
  }
});

var clear = setInterval(() => {
  var selectsql = 'SELECT * FROM traffic ORDER BY idx DESC';
  db.query(selectsql, (error, results)=>{
    if(error) {
      console.log("error");
    }else {
      if(!results[0]){
        console.log("수집된 데이터가 없습니다.");
      }else{
        var i = 0;
        for(i = 0; i < results.length; i++){
          var point = results[i].traffic_y + results[i].traffic_x*7;
          traffic_normal[point]++;
          if(status_normal[point] == 1){
            traffic_simple[0]++;
          }else if(status_normal[point] == 2){
            traffic_simple[1]++;
          }else {
            console.log("신호를 무시한 traffic 이 발생하였습니다. 입력자 또는 실제 상황을 주시하세요.");
          }
        }
      }
      var clearsql = 'DELETE FROM traffic';
    db.query(clearsql, function (error, results) {
      if (error) {
        status = "err";
        console.log("err");
      }
      else  {
        console.log("success delete");
      }
    });
    }
  });
  count++;
  if(count == 6){
    count = 0;
    // console.log(status_normal);
    console.log(traffic_normal);
    // console.log(traffic_simple);
    traffic_nomal = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
    traffic_simple = [0,0];
    status_nomal = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
  }
}, 1000);


module.exports = router;
