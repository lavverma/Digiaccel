const questionModel = require("../models/questionModel")
const responseModel = require("../models/responseModel")
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


const getQuestion = async function (req, res) {
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

        const questionData = await questionModel.findOne({ quizId: quizId, difficulty: 5, isDeleted: false })
        if (!questionData) {
            return res
                .status(404)
                .send({
                    status: false,
                    message: `Question is Not found `
                })
        }
        return res
            .status(200)
            .send({
                status: true,
                data: questionData
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


const response = async function (req, res) {
    try {
        const { quizId, participantId } = req.params
        if (!isValidId(quizId)) {
            return res
                .status(400)
                .send({
                    status: false,
                    message: `Quiz Id is not correct `
                })
        }
        if (!isValidRequest(req.body)) {
            return res
                .status(400)
                .send({
                    status: false,
                    message: `Please provide login credentials`
                })
        }
        const { questionId, chooseOption, difficulty } = req.body

        const question = await questionModel.findOne({ _id: questionId })
        const response = await responseModel.findOne({ participantId: participantId })
        const arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
        let flag = true
        for (let i of response.questionsAttempt) {
            if (!arr.includes(i)) {
                flag = false
            }
        }

        if (JSON.stringify(chooseOption.sort()) === JSON.stringify(question.correctOption.sort())) {
            await responseModel.findOneAndUpdate({ participantId: participantId }, { $push: { marks: 5 } })
            const res1 = await responseModel.findOneAndUpdate({ participantId: participantId }, { $push: { questionsAttempt: difficulty } }, { new: true })
            if (difficulty == 10) {
                return res
                    .status(200)
                    .send({
                        status: true,
                        data: { questionsAttempt: res1.questionsAttempt, marks: res1.marks }
                    })
            }
            if (!flag) {
                const nextQuestion = await questionModel.findOne({ difficulty: difficulty + 1 })
                return res
                    .status(200)
                    .send({
                        status: true,
                        data: nextQuestion
                    })
            } else {
                return res
                    .status(200)
                    .send({
                        status: true,
                        data: { questionsAttempt: res1.questionsAttempt, marks: res1.marks }
                    })
            }
        }
        else {
            await responseModel.findOneAndUpdate({ participantId: participantId }, { $push: { marks: -2 } })
            const res2 = await responseModel.findOneAndUpdate({ participantId: participantId }, { $push: { questionsAttempt: difficulty } }, { new: true })
            if (difficulty == 1) {
                return res
                    .status(200)
                    .send({
                        status: false,
                        data: { questionsAttempt: res2.questionsAttempt, marks: res2.marks }
                    })
            }
            if (!flag) {
                const preQuestion = await questionModel.findOne({ difficulty: difficulty - 1 })
                return res
                    .status(200)
                    .send({
                        status: true,
                        data: preQuestion
                    })
            } else {
                return res
                    .status(200)
                    .send({
                        status: true,
                        data: { questionsAttempt: res2.questionsAttempt, marks: res2.marks }
                    })
            }
        }
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

module.exports = { getQuestion, response }