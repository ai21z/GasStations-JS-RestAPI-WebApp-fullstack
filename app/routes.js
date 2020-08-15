
var bcrypt = require('bcryptjs');
var db = require('../config/database');

module.exports = function (app, passport) {
   app.get('/', isLoggedIn, function (req, res, next) {

      res.render('index', { user: req.session.passport.user || null });
   });

   app.post('/api/v1/login', function (req, res, next) {
      passport.authenticate('local-login', function (err, user, info) {
         if (info) return res.json(info);
         if (user) {
            req.login(user, function (err) {
               console.log(err);
            });
            res.json({ success: 'login ok' });
         }
      })(req, res, next);
   });

   app.post('/api/v1/signup', function (req, res, next) {
      passport.authenticate('local-signup', function (err, user, info) {
         if (err) console.log(err);
         console.log(user);
         console.log(info);
      })(req, res, next);
   });


   app.get('/result', async function (req, res) {
      let results = await new Promise((resolve, reject) => {
         db.query('SELECT * FROM mydb.gasstations', function (err, result, fields) {
            if (err) reject(err);
            else resolve(result);
         })
      }).then((result) => {
         res.json(result);
      }).catch((err) => {
         res.json(err);
      })
   });

   app.get('/getStationInfo/:id', async function (req, res) {
      let id = req.params.id;
      console.log(id);
      let results = await new Promise((resolve, reject) => {
         let sql = `SELECT * FROM mydb.gasstations 
            JOIN pricedata ON (gasstations.gasStationID = pricedata.gasStationID)
         WHERE gasstations.gasStationID =?`
         db.query(sql, id, function (err, result, fields) {
            if (err) reject(err);
            else resolve(result);
         })
      }).then((result) => {
         res.json(result);
      }).catch((err) => {
         res.json(err);
      })
   });

   app.get('/stats/price', async function (req, res) {
      await new Promise((resolve, reject) => {
         db.query('SELECT  ROUND (MIN(fuelPrice),3) AS minPrice, ROUND (AVG(fuelPrice),3) AS avgPrice, ROUND (MAX(fuelPrice),3) AS maxPrice FROM pricedata WHERE fuelTypeID=5', function (err, result, fields) {
            if (err) reject(err);
            else{
               db.query('SELECT COUNT(gasStationID) as count from gasstations',function(err,result2){
                  if(!err) resolve({Stats:result[0],CountGas:result2[0]});
               })
            } 
         })
      }).then((result) => {
         res.json(result);
      }).catch((err) => {
         res.json(err);
      })
   });


   //CHARTS
   app.get('/barchart', async function(req, res, next){
      const [rows, fields, error] = await db.query('SELECT fuelTypeID,COUNT(fuelTypeID) as count from pricedata GROUP BY fuelTypeID');
      if(error){       
         console.log(error);
      }else{
         let temp = [['fuelTypeID', 'count']];
         for(i=0; i<rows.length; i++){
            temp.push([rows[i].fuelTypeID, rows[i].count]);
         }
         return temp;
      };
   });

   app.post('/order', async function (req, res, next) {
      console.log(req.body);
      await new Promise((resolve,reject)=>{
         db.query('INSERT INTO orders SET ?',req.body,function (err,res) {
            if(!err) resolve({message:'Η παραγγελία καταχωρήθηκε'});
            else reject(err);
         });
      }).then((results)=>{
         console.log(results);
         res.json(results);
      }).catch((err)=>{
         res.json(err)
      })
   });


   app.get('/logout', (req, res) => {
      if (req.session) {
         req.session.destroy(function (err) {
            if (err) console.log(err);
            res.redirect('/');
         });
      }
   })
};

function isLoggedIn(req, res, next) {
   if (req.isAuthenticated()) {
      console.log("loggedin");
      return next();
   } else res.render('index', { user: null });

}

