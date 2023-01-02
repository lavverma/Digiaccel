const mongoose = require("mongoose")
const objectId = mongoose.Schema.Types.ObjectId

const responseSchema  = new mongoose.Schema({
    participantId : {
        type : objectId,
        ref : "Participant",
        required: true
    },
    quizId: {
        type: objectId,
        ref: "Quiz",
        required: true
    },
    isAttempted : {
        type : Boolean,
        default : false
    },
    questionsAttempt : {
        type : [Number],
        default : [0]
    },
    marks : {
        type : [Number],
        default : [0]
    }
})

module.exports = mongoose.model("Response", responseSchema)