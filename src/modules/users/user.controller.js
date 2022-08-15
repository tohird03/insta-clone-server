const UserSchema = require('./user.model')

const UserController = {
    ALL_USER: async(req, res) => {
        try {
            res.send(
                await UserSchema.find()
            )
        } catch (error) {
            console.log(error);
        }
    },
    OTHER_USER_PROFILE: async(req, res) => {
        try {
            const { userId } = req.params

            res.send(
                await UserSchema
                    .findOne({_id: userId }).populate({
                        path: "posts"
                    }).populate({
                        path: "followers"
                    }).populate({
                        path: "following"
                    })
            )
        } catch (error) {
            console.log(error);
        }
    },

    GET_USER: async(req, res) => {
        try {
            const { email } = req.headers

            res.send(
                await UserSchema
                    .findOne({email: email }).populate({
                        path: "posts"
                    }).populate({
                        path: "followers"
                    }).populate({
                        path: "following"
                    })
            )
        } catch (err) {
            console.log(err.message);
        }
    },
    FOUND_USER: async(req, res) => {
        try {
            const { email } = req.headers

            res.send(await UserSchema.findOne({email: email}))
        } catch (error) {
            console.log(error);
        }
    },

    POST_PROFILE: async(req, res) => {
        try {
            const { profile } = req.files
            const { author } = req.body

            profile?.mv(__dirname + "/../../uploads/" + profile?.name, (err) => {
                if(err) throw err
            })

            const profileUrl = `http://localhost:9000/assets/${profile.name}`
            const foundUser = await UserSchema.updateOne({ _id: author }, { profile: profileUrl })

            res.send("ok")
        } catch (error) {
            console.log(error);
        }
    },
    GET_FOLLOWERS: async(req, res) => {
        try {
            const { userId } = req.params

            const foundUser = await UserSchema.findOne({_id: userId}).populate({
                path: "followers"
            }).populate({
                path: "following"
            })

            res.send(foundUser)
        } catch (error) {
            console.log(error);
        }
    },
    ADD_BIO: async(req, res) => {
        try {
            const { author, bio } = req.body
            console.log(author, bio);
            const foundUser = await UserSchema.findOne({_id: author}).populate({
                path: "posts"
            }).populate({
                path: "followers"
            }).populate({
                path: "following"
            })

            foundUser.bio = bio

            foundUser.save()

            console.log(foundUser);
            res.send(foundUser)
        } catch (error) {
            console.log(error);
        }
    }
}

module.exports = UserController