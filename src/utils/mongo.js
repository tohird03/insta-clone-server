const moongose = require("mongoose")
const UserSchema = require('../modules/users/user.model')
const PostSchema = require('../modules/posts/post.model')
module.exports = mongo = async() => {
    try {
        return await moongose.connect('mongodb+srv://tohir:aaaassss@cluster0.od6mkh4.mongodb.net/tohir')
    } catch (err) {
        console.log(error.message);
    }
}