
const mongoose = require('mongoose')

const Post = new mongoose.Schema({
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true
  },
  img: {
    type: String,
    required: true
  },
  likes: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
  }],
  comment: [{
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    commentText: {
        type: String,
    },
    time: {
      type: String
    }
  }]
}, {
  timestamps: true
})

module.exports = mongoose.model('Post', Post)