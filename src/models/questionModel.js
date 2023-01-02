const mongoose = require("mongoose")
const objectId = mongoose.Schema.Types.ObjectId

const questionSchema = new mongoose.Schema({
    questionText: {
        type: String,
        required: true
    },
    options: {
        type: [
            {
                value: {
                    type: String,
                    required: true
                },
                isCorrect: {
                    type: Boolean,
                    required: true,
                }
            }
        ]
    },
    difficulty: {
        type: Number,
        required: true
    },
    moreThanOneCorrect: {
        type: Boolean,
        required: true,
        default: false
    },
    correctOption: {
        type: [Number],
        required: true,
    },
    quizName: {
        type: String,
        required: true,
    },
    quizId: {
        type: objectId,
        ref: "Quiz",
        required: true
    },
    adminId: {
        type: objectId,
        ref: "Admin",
        required: true
    },
    createdBy: {
        type: String,
        required: true,
    },
    isDeleted :{
        type : Boolean,
        default : false
    }
}, { timestamps: true })

module.exports = mongoose.model("Question", questionSchema)