const mongoose = require("mongoose")
const objectId = mongoose.Schema.Types.ObjectId

const quizSchema = new mongoose.Schema({
    quizName : {
        type : String,
        required : true,
        unique : true,
        trim : true
    },
    adminId : {
        type : objectId,
        ref : "Admin",
        required: true
    },
    longUrl : {
        type: String,
        trim: true
    },
    quizLink: {
        type: String,
        unique: true,
        trim: true
    },
    quizUrlCode: {
        type: String,
        unique: true,
        lowercase: true,
        trim: true
    }

},{timestamps : true})

module.exports = mongoose.model("Quiz", quizSchema)