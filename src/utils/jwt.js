require("dotenv").config()
const jwt = require('jsonwebtoken')

const sign = (payload) => jwt.sign(payload, "11112222", { expiresIn: "30d" })
module.exports = {
    sign
}