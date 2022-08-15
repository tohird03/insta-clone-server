const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const crypto = require('crypto')
const bcrypt = require('bcrypt')

const User = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Iltimos email kiriting']
  },
  name: {
    type: String,
    unique: true,
    required: [true, 'Iltimos ismingizni kiriting']
  },
  password: {
    type: String,
    required: [true, 'Iltimos parol kiriting'],
    minlength: 6
  },
  likedBlogs: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Post'
  }],
  bio: {
    type: String,
    maxlength: 60
  },
  profile: {
    type: String
  },
  posts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post'
  }],
  followers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
  following: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }]
}, {
  timestamps: true
})

User.methods.getSignedJwtToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRE
  })
}

User.methods.matchPassword = async function(enteredPassword){
  return await bcrypt.compare(enteredPassword, this.password)
}

module.exports = mongoose.model('User', User)
