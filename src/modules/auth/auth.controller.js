const UserSchema = require('../users/user.model')
require("dotenv").config()
const jwt = require("jsonwebtoken")
const bcrypt = require('bcrypt')
module.exports = {
    REGESTER_USER: async(req, res) => {
        try {
            const { email, name, password, reset_password } = req.body

            if(password !== reset_password){
                res.json({status: "Takroriy parol xato", loggedIn: false})
            }

            const foundUserEmail = await UserSchema.find({email: email})
            if(foundUserEmail.length !== 0) {
                res.json({status: "Bu email bilan avval ro'yxatdan o'tgansiz. Login qilib ko'ring", loggedIn: false})

                return
            }

            const foundUserName = await UserSchema.find({name: name})
            if(foundUserName.length !== 0){
                res.json({status: "Bunaqa ismli foydalanuvchi mavjud. Iltimos boshqa ism o'ylab toping", loggedIn: false})

                return
            }

            await UserSchema.create({
                email,
                name,
                password: await bcrypt.hash(password, 10),
                likedBlogs: [],
                profile: "",
                bio: "",
                followers: [],
                following: []
            })

            const sign = jwt.sign({user_email:  email}, "11112222", { expiresIn: "30d" })

            res.json({status: "Success", loggedIn: true, token: sign})

        } catch (err) {
            console.log(err);
        }
    },
    LOGIN_USER: async(req, res) => {
        try {
            const { name, password } = req.body

            const user = await UserSchema.findOne({ name: name })

            if (!user)  {
                res.json({status: "Bunaqa ismli foydalanuvchi topilmadi. Regestiratsiyadan o'ting", loggedIn: false})

                return
            }

            const users = await UserSchema.findOne({name: name})
            const isMatch = await bcrypt.compare(password, users.password)

            if (!isMatch) {
                res.json({status: "Parolingiz noto'g'ri", loggedIn: false})
                return
            }else {
                const sign = jwt.sign({user_email:  user.email}, "11112222", { expiresIn: "30d" })

                res.json({status: "Success", loggedIn: true, token: sign})
        }


        } catch (error) {
            console.log(error);
        }
    },
    GET_LOGIN: async(req, res) => {
        const { authtoken } = req.headers
        if(!authtoken) {
            res.json({status: "Token is not defined", loggedIn: false})
            return
        }else {
            jwt.verify(authtoken, "11112222", async(err, decode) => {
                const tokenTrue = decode ? await UserSchema.findOne({email: decode.user_email}) : null
                if(err instanceof jwt.TokenExpiredError) {
                    res.json({status: "Token invalid", loggedIn: false})
                    return
                }

                if(err instanceof jwt.JsonWebTokenError) {
                    res.json({status: "Token invalid", loggedIn: false})
                    return
                }

                if(!tokenTrue) {
                    res.json({status: "Token invalid", loggedIn: false})
                    return
                }else {
                    res.json({status: "Success!", loggedIn: true, token: authtoken})
                    return
                }
            })
        }
    }
}