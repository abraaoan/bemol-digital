var mongoose = require('mongoose');
var ObjectId = mongoose.Types.ObjectId;
var jwt = require('jsonwebtoken');
const config = require("../config/config");
const secret = config.SECRET;

var isDefined = function isDefined(body, param) {

    var b = JSON.stringify(body);

    //DEBUG
    // console.log(b);
    // console.log(param);

    if (b.indexOf(param) > -1){
        return true;
    }
    return false;

}

var addIds = function addIds(ids){

	var resultIds = [];

    for (var i in ids) {
        var id = new ObjectId(ids[i]);
        resultIds[i] = id;
    }

    return resultIds;
}

var tokenValid = function tokenValid(token, callback) {
    if (token) {
        jwt.verify(token, secret, function(err, decoded) {      
            if (err) {
                var error = { success: false, message: 'Failed to authenticate token.', error: err };
                callback(true, error);
            } else {
                callback(false);
            }
        });
    } else {
        var error = { success: false, message: 'No token provided.' };
        callback(true, error);
    }
}

var verify = (req, res, completion) => {
  var token = req.body.token || req.query.token || req.headers['x-access-token'];
  if (token) {
      jwt.verify(token, secret, function(err, decoded) {      
          if (err) {
              res.status(401).json({ success: false, message: 'Failed to authenticate token.', error: err });
          } else {
              completion()
          }
      });
  } else {
      res.status(401).json({ success: false, message: 'No token provided.' });
  }
}

exports.isDefined = isDefined;
exports.addIds    = addIds;
exports.tokenValid = tokenValid;
exports.secret  = secret;
exports.verify = verify;
