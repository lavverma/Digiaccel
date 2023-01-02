const questionModel = require("../models/questionModel")
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

const createQuestion = async function (req, res) {
    try {
        const { adminId, quizId } = req.params

        if (!isValidId(quizId)) {
            return res
                .status(400)
                .send({
                    status: false,
                    message: `Quiz Id is not correct `
                })
        }

        const quizData = await quizModel.findOne({ _id: quizId, adminId: adminId }).populate("adminId")

        if (!quizData) {
            return res
                .status(400)
                .send({
                    status: false,
                    message: 'Quiz name is not correct'
                })
        }

        const allQuestions = await questionModel.find({ quizId: quizId, isDeleted: false })
        if (allQuestions.length == 10) {
            return res
                .status(400)
                .send({
                    status: false,
                    message: 'Already 10 Questions are added for this Quiz'
                })
        }


        const questionData = req.body

        if (!isValidRequest(questionData)) {
            return res
                .status(400)
                .send({
                    status: false,
                    message: `Please provide Question details`
                })
        }
        questionData.quizName = quizData.quizName
        questionData.quizId = quizId,
            questionData.adminId = adminId,
            questionData.createdBy = quizData.adminId.fname

        const { questionText, options, difficulty, moreThanOneCorrect, correctOption } = questionData

        const checkBoolean = [true, false]
        if (!isValidString(questionText)) {
            return res
                .status(400)
                .send({
                    status: false,
                    message: `Please provide Question properly`
                })
        }
        if (!difficulty || isNaN(difficulty) || difficulty > 10 || difficulty < 0) {
            return res
                .status(400)
                .send({
                    status: false,
                    message: `Give difficulty level in between 1-10`
                })
        }

        if (!checkBoolean.includes(moreThanOneCorrect)) {
            return res
                .status(400)
                .send({
                    status: false,
                    message: `moreThanOneCorrect oly true/false`
                })
        }

        if (!Array.isArray(correctOption)) {
            return res
                .status(400)
                .send({
                    status: false,
                    message: `All options are in array format`
                })
        }

        if (moreThanOneCorrect == checkBoolean[1]) {
            if (correctOption.length > 1) {
                return res
                    .status(400)
                    .send({
                        status: false,
                        message: `moreThanOneCorrect : false, you need to give only correct answer`
                    })
            }
        }

        for (let i of correctOption) {
            if (isNaN(i)) {
                return res
                    .status(400)
                    .send({
                        status: false,
                        message: `Options are only 1/2/3/4`
                    })
            }
        }

        if (options.length != 4) {
            return res
                .status(400)
                .send({
                    status: false,
                    message: `You need to provide Four Options `
                })
        }

        let arr = []
        for (let i of options) {
            if (!isValidString(i.value)) {
                return res
                    .status(400)
                    .send({
                        status: false,
                        message: `Please provide options properly`
                    })
            }
            if (!checkBoolean.includes(i.isCorrect)) {
                return res
                    .status(400)
                    .send({
                        status: false,
                        message: `isCorrect only true/false`
                    })
            }
            arr.push(i.isCorrect)
        }

        if (!arr.includes(true)) {
            return res
                .status(400)
                .send({
                    status: false,
                    message: `Give any correct answer`
                })
        }

        for (let i of correctOption) {
            if (options[i - 1].isCorrect == false) {
                return res
                    .status(400)
                    .send({
                        status: false,
                        message: `Give correct answers`
                    })
            }
        }

        for (let i of allQuestions) {
            if (difficulty == i.difficulty) {
                return res
                    .status(400)
                    .send({
                        status: false,
                        message: `This Difficulty level Already given, Please Choose another`
                    })
            }
        }

        const createdQuestion = await questionModel.create(questionData)

        return res
            .status(201)
            .send({
                status: true,
                data: createdQuestion
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


const getQuestions = async function (req, res) {
    try {
        const { quizId } = req.params

        if (!isValidId(quizId)) {
            return res
                .status(400)
                .send({
                    status: false,
                    message: `Quiz Id is not correct `
                })
        }

        const allQuestions = await questionModel.find({ quizId: quizId, isDeleted: false }).sort({ difficulty: 1 })

        return res
            .status(200)
            .send({
                status: true,
                data: allQuestions
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


const deleteQuestion = async function (req, res) {
    try {
        const questionId = req.params.quizId
        if (!isValidId(questionId)) {
            return res
                .status(400)
                .send({
                    status: false,
                    message: `Question Id is not correct `
                })
        }
        const question = await questionModel
            .findOneAndUpdate(
                {
                    _id: questionId,
                    isDeleted: false
                },
                { $set: { isDeleted: true } },
                { new: true })
        if (!question) {
            return res
                .status(404)
                .send({
                    status: false,
                    message: `Questions are not be added yet`
                })
        }

        return res
            .status(200)
            .send({
                status: true,
                message: "Question Deleted Successfully"
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

module.exports = { createQuestion, getQuestions, deleteQuestion }