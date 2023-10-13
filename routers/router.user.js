var express = require('express');
var mongoose = require('mongoose');
var commom = require('../utils/commons');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var ObjectId = mongoose.Types.ObjectId; 
var router = express.Router();

// Model
var User = require('../db_models/db.user');
var secret = commom.secret;

const dev_env = process.env.NODE_ENV === `development`;

// Sign In
router.route('/user/authenticate')
  .post(async (req, res) => {

    const email = req.body.email;
    const user = await User.findOne({ email: email }).select('+password');

    if (!commom.isDefined(user, "password")) {
      res.json({ success: false, message: 'Authentication failed. User not found.' });
      return
    }

    const passwordIsValid = bcrypt.compareSync(
      req.body.password,
      user.password
    );
    
    if (!user) {
      res.json({ success: false, message: 'Authentication failed. User not found.' });
    } else if (!passwordIsValid) {   
      res.json({ success: false, message: 'Authentication failed. Something wrong.' });
    } else {
      const expires = dev_env ? '1h' : '30 days'
      const token = jwt.sign({ user: user.email }, secret, { expiresIn: expires });
      res.json({ success: true, user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        deviceId: user.deviceId,
        profileImage: user.profileImage,
        cep: user.cep,
        endereco: user.endereco,
        token,
      } });
    }
});

router.route('/user')
  // Sign Up
  .post((req, res) => {
    validateField(req.body, async (error) => {
      if (error) {
        res.status(400).json(error);
        return;
      }

      console.log('---->', req.body);

      const pass = bcrypt.hashSync(req.body.password, 8);
      var user = new User();

      user.name = req.body.name;
      user.email = req.body.email;
      user.password = pass;
      user.profileImage = req.body.profileImage;
      user.cep = req.body.cep;
      user.endereco = req.body.endereco;

      try {
        await user.save()
        res.json({ success: true });
      } catch (error) {
        if (checkSignUpErrorEmailExist(error)) {
          res.status(400).json({ success: false, message: "Email already in use." });
        } else {
          res.status(400).json({ success: false, error: error });
        }
      }
    });
  })

  // Get users
  .get((req, res) => {
      commom.verify(req, res, async () => {
        try {
          const users = await User.find();
          res.send({success: false, users});
        } catch (error) {
          res.status(400).json({ success: false, error: error });
        }
      });
  });

  // Get user by id
router.route('/user/:id_user')
  .get((req, res) => {
    commom.verify(req, res, async () => {
      try {
        const id = new ObjectId(req.params.id_user);
        const user = await User.findOne({ _id: id });
        res.send({success: true, user});
      } catch (error) {
        res.status(400).json({ success: false, error: error });
      }
    });
  });

router.route('/user/:id_user')
  // Update user by id
  .put((req, res) => {
    commom.verify(req, res, async () => {
      const id = new ObjectId(req.params.id_user);
      const user = await User.findById(id);
      verifyAndSetUser(user, req.body);

      try {
        await user.save();
        res.json({ success: true, message: 'User updated!' });
      } catch (error) {
        res.status(400).json({ success: false, error: error });
      }
    });
  })

  // Delete user by id
  .delete((req, res) => {
    commom.verify(req, res, async () => {
      var id = new ObjectId(req.params.id_user);
      try {
        await User.deleteOne({'_id': id});
        res.json({ success: true, message: 'Successfully deleted' });
      } catch (error) {
        res.status(400).json({ success: false, error: error });
      }
    });
  });

var checkSignUpErrorEmailExist = (error) => {
  if (error.keyPattern.email) {
    const email = error.keyPattern.email
    if (email == 1) {   
      return true;
    }
  }

  return false;
}

var validateField = (body, next) => {
  if (!commom.isDefined(body, "name")) {
    next({ success: false, message: "Name is required." });
  } else if (!commom.isDefined(body, "email")) {
    next({ success: false, message: "Email is required." });
  } else if (!commom.isDefined(body, "password")) {
    next({ success: false, message: "Password is required." });
  } else if (!commom.isDefined(body, "cep")) {
    next({ success: false, message: "CEP is required." });
  } else {
    next();
  }
}

var verifyAndSetUser = (user, body) => {
  if (commom.isDefined(body, "name"))
    user.name = body.name;

  if (commom.isDefined(body, "profileImage"))
    user.profileImage = body.profileImage;

  if (commom.isDefined(body, "cep"))
    user.cep = body.cep;

  if (commom.isDefined(body, "endereco"))
    user.endereco = body.endereco;
}

module.exports = router;
