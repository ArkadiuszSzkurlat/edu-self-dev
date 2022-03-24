const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');

exports.getLoginForm = (req, res) => {
    res.status(200).render('../../altum-app-frontend/src/components/LogIn/LogIn', {
      title: 'Zaloguj się do swojego konta.'
    });
  };
  
  exports.getAccount = (req, res) => {
    res.status(200).render('account', {
      title: 'Your account'
    });
  };
  
  exports.updateUserData = catchAsync(async (req, res, next) => {
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      {
        name: req.body.name,
        email: req.body.email
      },
      {
        new: true,
        runValidators: true
      }
    );
  
    res.status(200).render('account', {
      title: 'Your account',
      user: updatedUser
    });
  });
  