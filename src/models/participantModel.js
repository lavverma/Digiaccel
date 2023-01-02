const mongoose = require("mongoose")
const objectId = mongoose.Schema.Types.ObjectId


const participantSchema  = new mongoose.Schema({
    fname : {
        type: String,
        required : true,
        trim : true
    },
    lname : {
        type: String,
        required : true,
        trim : true
    },
    email : {
        type : String,
        required : true,
        unique : true,
        trim : true
    },
    quizName : {
        type : String,
        required : true
    },
    quizId: {
        type: objectId,
        ref: "Quiz",
        required: true
    },
    isDeleted :{
        type : Boolean,
        default : false
    }
},{timestamps : true})


module.exports = mongoose.model("Participant", participantSchema)