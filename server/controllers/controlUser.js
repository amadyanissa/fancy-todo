const modelUser = require('../models/modelUser')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')


class ControlUser {
    static register(req, res, next) {
        // res.status(200).json(req.body)
        modelUser.find({ username: req.body.username })
            .then(resultPencarian => {
                if (resultPencarian[0]) {
                    console.log("ada nih username")
                    console.log(resultPencarian)
                    res.status(400).json({ message: "username is already used" })
                } else {
                    // console.log("ok gaada")
                    return modelUser.create(req.body)

                }
            })
            .then(userTerdaftar => {
                console.log(userTerdaftar, "ini data username yang baru register")
                // console.log(userTerdaftar)
                const token = jwt.sign({ id: userTerdaftar._id }, process.env.JWT_SECRET)
                console.log(token, "ini token, user logged in")

                req.headers.token = token
                res.status(200).json({ userTerdaftar, message: "registered successfully" })
            })
            .catch(err => {
                res.status(500).json({ err, message: "Internal Server Error from register" })
            })
    }

    static login(req, res, next) {
        modelUser.findOne({ username: req.body.username })
            .then(userNameFound => {
                if (!userNameFound) {
                    console.log("tidak ada usernamenya")
                    res.status(400).json({ message: "username/password is wrong" })
                } else {
                    console.log(userNameFound, "ada usernamenya")
                    const cocokPass = bcrypt.compareSync(req.body.password, userNameFound.password)
                    // console.log(cocokPass, "ini cocokpas")
                    if (cocokPass) {
                        const token = jwt.sign({ id: userNameFound.id }, process.env.JWT_SECRET)
                        console.log(token, "ini token, user logged in")

                        req.headers.token = token
                        res.send(req.headers)

                    } else {
                        res.status(400).json({ message: "username/password is wrong" })
                    }
                }
            })
            .catch(err => {
                res.status(500).json({ err, message: "Internal Server Error from login" })
            })
    }

}

module.exports = ControlUser