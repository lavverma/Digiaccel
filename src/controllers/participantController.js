const participantModel = require("../models/participantModel")
// const bcrypt =  require("bcrypt")
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
const jwt = require("jsonwebtoken")
const quizModel = require("../models/quizModel")
const responseModel = require("../models/responseModel")


const createParticipant = async function (req, res) {
    try {
        const participantData = req.body
        const quizId = req.params.quizId

        if (!isValidRequest(participantData)) {
            return res
                .status(400)
                .send({
                    status: false,
                    message: `Please provide login credentials`
                })
        }

        const { fname, lname, email} = participantData

        if (!fname) {
            return res
                .status(400)
                .send({ status: false, message: "First Name is required" });
        }

        if (!isValidString(fname) || !isValidName(fname)) {
            return res
                .status(400)
                .send({ status: false, message: "Enter first name is required" });
        }

        if (!lname) {
            return res
                .status(400)
                .send({ status: false, message: "Last Name is required" });
        }

        if (!isValidString(lname) || !isValidName(lname)) {
            return res
                .status(400)
                .send({ status: false, message: "Enter last name is required" });
        }

        if (!email) {
            return res
                .status(400)
                .send({ status: false, message: "Email is required" });
        }

        if (!isValidString(email) || !isValidMail(email)) {
            return res
                .status(400)
                .send({ status: false, message: "Enter email in proper format" });
        }

        const isDuplicateEmail = await participantModel.findOne({ email :email , isDeleted : false});
        if (isDuplicateEmail) {
            return res
                .status(409)
                .send({
                    status: false,
                    message: `EmailId already in use`
                });
        }

        
        const quiz = await quizModel.findOne({_id : quizId})

        if(!quiz){
            return res
                .status(400)
                .send({
                    status: false,
                    message: `quiz is not present`
                });
        }

        participantData.quizId= quizId
        participantData.quizName = quiz.quizName
        const newAddedParticipant = await participantModel.create(participantData)
        await responseModel.create({participantId : newAddedParticipant._id, quizId : quizId })

        return res
            .status(201)
            .send({
                status: true,
                data: newAddedParticipant
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


const getAllParticipants = async function(req, res){
  try {
  const quizId = req.params.quizId
       if(!isValidId(quizId)){
        return res
        .status(400)
        .send({ status: false, message: "Quiz id not valid" });
       }

       const AllParticipantsList = await participantModel.find({quizId : quizId, isDeleted :false})
       if(AllParticipantsList.length == 0){
        return res
        .status(404)
        .send({ status: false, message: "No participant found" });
       }

       return res
       .status(200)
       .send({
           status: true,
           data: AllParticipantsList
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

const deleteParticipant = async function(req, res){
    try{
       const participantId = req.params.participantId
       if(!isValidId(participantId)){
        return res
        .status(400)
        .send({ status: false, message: "Participant id not valid" });
       }
      const parti =  await  participantModel
      .findOneAndUpdate(
        {
            _id : participantId, 
            isDeleted :false
        }, 
            {$set:{isDeleted:true}}, 
            {new : true}
            )
            if(!parti){
                return res
                .status(404)
                .send({ status: false, message: "Participant id not Found" });
               }
               return res
               .status(200)
               .send({status : true, message : "Participant is Deleted Successfully"})

    
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


const participantLogin = async function(req,res){
try{
    
    if (!isValidRequest(req.body)) {
        return res
            .status(400)
            .send({
                status: false,
                message: `Please provide login credentials`
            })
    }
    const {email, name} = req.body
    if(!name){
        return res
            .status(400)
            .send({
                status: false,
                message: `Please provide Your Name`
            })
    }
    if (!isValidString(name)) {
        return res
            .status(400)
            .send({ status: false, message: "Enter Your name properly" });
    }
   
    if (!email) {
        return res
            .status(400)
            .send({ status: false, message: "Email is required" });
    }

    if (!isValidString(email) || !isValidMail(email)) {
        return res
            .status(400)
            .send({ status: false, message: "Enter email in proper format" });
    }

    const participant = await participantModel.findOne({email : email, isDeleted : false})

    if(!participant){
        return res
            .status(400)
            .send({ status: false, message: "You are not allow to give this quiz" });
    }

    const token = jwt.sign({
        participantId: participant._id.toString()
    },
        process.env.JWT_SECRET_KEY
    )

    return res
    .status(200)
    .send({
        status: true,
        data: token
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
module.exports = {createParticipant, getAllParticipants, deleteParticipant, participantLogin}