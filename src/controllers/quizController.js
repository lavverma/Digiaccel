const quizModel = require("../models/quizModel")
const { isValidRequest,
    isValidString,
    isValidName,
    isValidMail,
    isValidPhone,
    isValidPassword,
    isValidPincode,
    isValidId,
    isValidTitle,
    isValidPrice,
    isValidSize,
    isValidValue
} = require("../validators/validation")
const shortId = require("shortid")

const createQuiz = async function (req, res) {
    try {
        const adminId = req.params.adminId
        const quizName = req.body.quizName

        if (!isValidId(adminId)) {
            return res
                .status(400)
                .send({
                    status: false,
                    message: `Admin ID is not correct`
                })
        }

        const matched = await quizModel.findOne({ quizName: quizName, adminId: adminId })
        if (matched) {
            return res
                .status(409)
                .send({
                    status: false,
                    message: `Quiz Name is already Used...Please use Different Name`
                })
        }

        const quiz = await quizModel.create({ adminId: adminId, quizName: quizName })

        const longUrl = `${process.env.CLIENT_URL}/participantLogin/${quiz._id}`
        const quizUrlCode = shortId.generate(longUrl).toLowerCase()
        const quizLink = `${process.env.SERVER_URL}/getQuiz/${quizUrlCode}`

        const quizData = await quizModel
            .findOneAndUpdate(
                {
                    quizName: quizName,
                    adminId: adminId
                },
                {
                    $set:
                    {
                        longUrl: longUrl,
                        quizUrlCode: quizUrlCode,
                        quizLink: quizLink
                    }
                },
                { new: true }
            )
        return res
            .status(201)
            .send({
                status: true,
                data: quizData
            })
    }

    catch (err) {
        return res
            .status(500)
            .send({
                status: false,
                message: err.message
            })
    }
}

const getQuizLink = async function (req, res) {
    try {
        const quizId = req.params.quizId

        if (!isValidId(quizId)) {
            return res
                .status(400)
                .send({
                    status: false,
                    message: `Quiz Id is not correct `
                })
        }

        const quizData = await quizModel.findOne({ _id: quizId })
        if (!quizData) {
            return res
                .status(404)
                .send({
                    status: false,
                    message: `Quiz is Not found `
                })
        }

        return res
            .status(200)
            .send({
                status: true,
                data: quizData.quizLink
            })
    }
    catch (err) {
        return res
            .status(500)
            .send({
                status: false,
                message: err.message
            })
    }
}


const redirect = async function (req, res) {
    try {
        let urlCode = req.params.urlCode
        console.log(urlCode)
        let urlData = await quizModel.findOne({ quizUrlCode: urlCode })
        if (!urlData) return res.status(404).send({ status: false, message: "No url found" })
        let longUrl = urlData.longUrl
        return res.redirect(302, longUrl)
    }
    catch (err) {
        res.status(500).send({ status: false, message: err.message })
    }
}

module.exports = { createQuiz, getQuizLink, redirect }