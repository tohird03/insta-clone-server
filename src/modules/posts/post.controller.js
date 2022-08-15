const PostModel = require('./post.model')
const UserSchema = require('../users/user.model')
module.exports = {
    // GET USERS POSTS
    GET: async(req, res) => {
        try {
            res.send(
                await PostModel.find().populate({
                    path: "author"
                }).populate({
                    path: "likes"
                }).populate({
                    path: "author.followers"
                }).populate({
                    path: "author.following"
                })
            )
        } catch (err) {
            console.log(err.message);
        }
    },

    // POST USERS POSTS
    POST: async(req, res) => {
        try {

            const { imgs } = req.files
            const { author, title } = req.body

            imgs?.mv(__dirname + "/../../uploads/" + imgs?.name, (err) => {
                if(err) throw err
            })

            const newPost = new PostModel(
                {
                    author: author,
                    title: title,
                    img: `http://localhost:9000/assets/${imgs.name}`,
                    likes: []
                }
            )

            const foundUser = await UserSchema.findById(author)

            foundUser.posts.unshift(newPost._id)

            await newPost.save()
            await foundUser.save()

            res.send("ok")
        } catch (error) {
            console.log(error);
        }
    },

    // ADD POST LIKES
    POST_LIKES: async(req, res) => {
        try {
            const { imgId, userEmail } = req.body

            const foundUser = await UserSchema.findOne({
                email: userEmail
            })

            const foundPost = await PostModel.findOne({
                _id: imgId
            })

            if(!foundUser?.likedBlogs.includes(imgId)) {
                foundUser?.likedBlogs.push(imgId)
                foundPost?.likes.push(foundUser?._id)
            }else {
                const likesIndex = foundUser?.likedBlogs.findIndex((e) => e == imgId)
                const desLikesIndex = foundPost?.likes.findIndex((e) => e == foundUser?._id)
                foundUser?.likedBlogs.splice(likesIndex, 1)
                foundPost?.likes.splice(desLikesIndex, 1)
            }

            await foundUser.save()
            await foundPost.save()

            res.send(await UserSchema.findOne({
                email: userEmail
            }))
        } catch (err) {
            console.log(err.message);
        }
    },

    // GET ALL LIKES
    GET_POST_LIKES: async(req, res) => {
        try {
            res.send(await UserSchema.find())
        } catch (error) {
            console.log(error);
        }
    },

    // POST LIKES
    GET_POST_LIKES_USER: async(req, res) => {
        try {
            const { imgId } = req.body

            res.send(await PostModel.findOne({_id: imgId}).populate({
                path: "author"
            }).populate({
                path: "likes"
            }))
        } catch (error) {
            console.log(error);
        }
    },

    // GET COMMENT
    GET_COMMENTS: async (req, res) => {
        try {
            const { postId } = req.params

            const foundPost = await PostModel.findOne({_id: postId}).populate({
                path: "comment.userId"
            }).populate({
                path: "author"
            })

            if(!foundPost) {
                res.send("Not post")
            }else {
                res.send(foundPost)
            }

        } catch (error) {
            console.log(error);
            res.send(error)
        }
    },

    // ADD COMMENT
    POST_COMMENT: async(req, res) => {
        try {
            const { userEmail, commentText, postId } = req.body

            const findUser = await UserSchema.findOne({
                email: userEmail
            })

            const foundPost = await PostModel.findOne({_id: postId}).populate({
                path: "author"
            })  .populate({
                path: "comment.userId"
            })

            const today = new Date()

            const newComments = {
                userId: findUser,
                commentText: commentText,
                time: today
            }

            foundPost.comment.push(newComments)

            foundPost.save()

            res.send(foundPost)
        } catch (error) {
            console.log(error);
        }
    },

    // ADD FOLLOWING
    POST_FOLLOWING: async(req, res) => {
        try {
            const { userId, followersUserEmail } = req.body
            const foundFollowersUser = await UserSchema.findOne({ email: followersUserEmail })

            const foundFollowingUser = await UserSchema.findOne({ _id: userId })

            if(!foundFollowersUser.following.includes(userId)) {
                console.log("a");
                foundFollowersUser.following.push(userId)
                foundFollowingUser.followers.push(foundFollowersUser?._id)
            }else {
                const foundFollowersUserIndex = foundFollowersUser.following.findIndex(e => e == userId)
                const foundFollowingUserIndex = foundFollowingUser.followers.findIndex(e => e == foundFollowersUser?._id)

                foundFollowersUser.following.splice(foundFollowersUserIndex, 1)
                foundFollowingUser.followers.splice(foundFollowingUserIndex, 1)
            }

            foundFollowersUser.save()
            foundFollowingUser.save()

            res.send(await PostModel.find().populate({
                path: "author"
            }).populate({
                path: "likes"
            }))

        } catch (error) {
            console.log(error);
        }
    }
}