require("dotenv").config()
const express = require("express")
const cors = require('cors')
const path = require('path')
const fileUpload = require("express-fileupload")
const PORT = process.env.PORT || 9000
const mongo = require('./utils/mongo')
const router = require('./modules')
const app = express()

app.use(express.json())
app.use(cors())
app.use("/assets", express.static(path.join(__dirname, "public")))
app.use("/assets", express.static(path.join(__dirname, "uploads")))

mongo()
    .then(() => console.log('Connected'))
    .catch(err => console.log(err.message))

app.use(fileUpload())
app.use(router)

app.listen(PORT, () => {
    console.log(`App listen ${PORT} port`);
})
