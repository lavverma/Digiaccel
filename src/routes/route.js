const express= require("express")
const { createAdmin, adminLogin , adminPanel} = require("../controllers/adminController")
const  {authentication, authorization, authorization2} = require("../middlewares/auth")
const {createQuiz, getQuizLink, redirect} = require("../controllers/quizController")
const {createQuestion, getQuestions, deleteQuestion} = require("../controllers/questionController")
const { createParticipant, getAllParticipants, deleteParticipant, participantLogin } = require("../controllers/participantController")
const { getQuestion, response } = require("../controllers/responseController")
const router = express.Router()


router.post("/adminLogin" ,   adminLogin)
router.get("/adminPanel" , authentication, adminPanel)
router.post("/addAdmin/:adminId", authentication, authorization, createAdmin )

router.post("/addQuiz/:adminId", authentication, authorization, createQuiz )
router.get("/quizLink/:adminId/:quizId", authentication, authorization, getQuizLink )
router.get("/getQuiz/:urlCode", redirect)

router.post("/addQuestion/:adminId/:quizId" , authentication, authorization,createQuestion)
router.get("/getQuestions/:adminId/:quizId",authentication, authorization,getQuestions)
router.delete("/deleteQuestion/:adminId/:quizId", authentication, authorization, deleteQuestion)

router.post("/createParticipant/:adminId/:quizId", authentication,authorization, createParticipant)
router.post("/participantLogin",participantLogin)
router.get("/getParticipant/:adminId/:quizId", authentication,authorization, getAllParticipants)
router.delete("/deleteParticipant/:adminId/:participantId", authentication,authorization, deleteParticipant)
router.get("/getQuestion/:participantId/:quizId",authentication,authorization2, getQuestion)

router.put("/response/:participantId/:quizId" ,authentication,authorization2, response)

module.exports = router