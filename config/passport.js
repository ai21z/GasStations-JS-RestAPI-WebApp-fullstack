var LocalStrategy = require("passport-local").Strategy;

var db = require('../config/database');
var bcrypt = require('bcryptjs');
var routes = require('../app/routes.js');

module.exports = function (passport) {
  passport.serializeUser(function (user, done) {
    done(null, user.username);
  });

  passport.deserializeUser(function (username, done) {
    db.query("SELECT * FROM users WHERE username = ? ", [username],
      function (err, rows) {
        done(err, rows[0]);
      });

  });

  passport.use(
    'local-signup',
    new LocalStrategy({
      usernameField: 'username',
      passwordField: 'password',
      passReqToCallback: true
    },
      function (req, username, password, done) {
        console.log(username, password)
        db.query("SELECT * FROM users WHERE username = ? ", [username], function (err, rows) {
          console.log(rows);          
          if (err)
            return done(err);
          if (rows.length) {
            return done(null, false, { error: 'That is already taken' });
          } else {
            var newUserMysql = {
              username: username,
              email: req.body.email,
              password: bcrypt.hashSync(password)
            };
            var insertQuery = "INSERT INTO users SET ?";
            console.log(newUserMysql);
            db.query(insertQuery, newUserMysql,
              function (err) {
                if (err) console.log(err);
                else return done(null, { success: 'Register OK!' });
              });
          }
        });
      })
  );

  passport.use('local-login', new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true
  },
    function (req, username, password, done) {
      console.log(username);
      db.query("SELECT * FROM users WHERE username = ? ", [username], function (err, rows) {
        if (err)
          return done(err);
        if (!rows.length) {
          return done(null, false, { error: 'No User Found' });        
        
        } else {
          if (!bcrypt.compareSync(password, rows[0].password) && password !== rows[0].password) {
            return done(null, false, { error: 'Wrong Password' });
          } else return done(null, rows[0]);
        }

      });

    })
  );
};