const jwt = require("jsonwebtoken")
const adminModel = require('../models/adminModel');
const participantModel = require("../models/participantModel");
const { isValidId } = require("../validators/validation");

const authentication = function (req, res, next){
    try{
    const token = req.headers.token
    if (!token)
      return res
        .status(401)
        .send({ status: false, message: "token must be present" });

        jwt.verify(token, process.env.JWT_SECRET_KEY,function (error, decoded){
            if (error) {
              return res
                .status(401)
                .send({ status: false, message: error.message });
            } else {
              // creating an attribute in "req" to access the token outside the middleware
              req.token = decoded;
              next();
            }
          })
        }
        catch(error){
            return res
                    .status(500)
                    .send({status: false, message: error.message})
        }
}

const authorization = async function(req, res, next){
    try{
        let adminId = req.params.adminId;
        let userLoggedIn = req.token.adminId;
        if(!isValidId(adminId)){
            return res
                .status(400)
                .send({status: false, message:"Enter valid format of userId"})
        }
        
        const user = await adminModel.findOne({_id: adminId})
        if(!user){
            return res
                .status(404)
                .send({status: false, message:"No such user found"})
        }

        if(userLoggedIn != adminId){
          return res
              .status(403)
              .send({status: false, message:"You are not authorized to perform this task"})
      }

        next();
    }
    catch(error){
        return res
                .status(500)
                .send({status: false, message: error.message})
    }
}


const authorization2 = async function(req, res, next){
    try{
        let participantId = req.params.participantId;
        let userLoggedIn = req.token.participantId;
        if(!isValidId(participantId)){
            return res
                .status(400)
                .send({status: false, message:"Enter valid format of userId"})
        }
        
        const user = await participantModel.findOne({_id: participantId})
        if(!user){
            return res
                .status(404)
                .send({status: false, message:"No such user found"})
        }

        if(userLoggedIn != participantId){
          return res
              .status(403)
              .send({status: false, message:"You are not authorized to perform this task"})
      }

        next();
    }
    catch(error){
        return res
                .status(500)
                .send({status: false, message: error.message})
    }
}

module.exports = {authentication, authorization, authorization2}