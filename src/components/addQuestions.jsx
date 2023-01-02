import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { toast } from 'react-hot-toast'
import { useNavigate, useParams } from 'react-router-dom'
import "../styles/addQuestion.css"

const url = import.meta.env.VITE_SERVER_URL

const AddQuestions = () => {
  const navigator = useNavigate()
  const { adminId, quizId } = useParams()
  const [question, setQuestion] = useState({
    questionText: '',
    opt1: '',
    opt2: '',
    opt3: '',
    opt4: '',
    difficulty: '',
    moreThanOneCorrect: "False",
    correctOption: []
  })

  const [show, setShow] = useState(false)
  const [showAddQuestion, setShowAddQuestion] = useState(true)
  const [btnParticipants, setBtnParticipants] = useState(false)
  const [render, setRender] = useState(true)
  const [allQuestions, setAllQuestions] = useState([])

  const array = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
  const option = [1, 2, 3, 4]
  const questionData = (e) => {
    e.preventDefault()
    const { name, value } = e.target
    setQuestion({
      ...question,
      [name]: value
    })
  }

  const difficulty = (e) => {
    setQuestion({
      ...question,
      difficulty: e.target.name
    })
  }


  const moreThanOneCorrect = (e) => {
    setQuestion({
      ...question,
      moreThanOneCorrect: e.target.name,
      correctOption: []
    })
  }

  const isCorrect = (e) => {
    let curr = e.target.name
    if (question.correctOption.length < 5) {
      let idx = question.correctOption.indexOf(curr)
      if (idx == -1) {
        setQuestion({
          ...question,
          correctOption: [...question.correctOption, curr]
        })
      }
      else {
        let arr = [...question.correctOption]
        arr.splice(idx, 1)
        setQuestion({
          ...question,
          correctOption: arr
        })
      }
    }
  }


  const finalQuestionData = {
    questionText: question.questionText,
  }
  finalQuestionData.difficulty = parseInt(question.difficulty)
  finalQuestionData.moreThanOneCorrect = question.moreThanOneCorrect == "True" ? true : false
  finalQuestionData.correctOption = []

  finalQuestionData.options = [
    {
      value: question.opt1,
      isCorrect: false
    },
    {
      value: question.opt2,
      isCorrect: false
    },
    {
      value: question.opt3,
      isCorrect: false
    },
    {
      value: question.opt4,
      isCorrect: false
    }
  ]
  for (let i of question.correctOption) {
    finalQuestionData.correctOption.push(parseInt(i))
  }
  for (let i = 0; i < finalQuestionData.correctOption.length; i++) {
    finalQuestionData.options[finalQuestionData.correctOption[i] - 1].isCorrect = true
  }

  const token = document.cookie.slice(4)

  const addQuestion = async (e) => {
    let ans = window.confirm("Want to Recheck question Details")
    if (!ans) {
      try {
        await axios.post(`${url}/addQuestion/${adminId}/${quizId}`, finalQuestionData, { headers: { token: token } })
        setQuestion({
          questionText: '',
          opt1: '',
          opt2: '',
          opt3: '',
          opt4: '',
          difficulty: '',
          moreThanOneCorrect: "False",
          correctOption: []
        })
        toast.success("Question has been added")
        setRender(!render)
      }
      catch (err) {
        toast.error(err.response.data.message)
      }
    }
  }

  const deleteQuestion = async (e) => {
    let ans = window.confirm("You are sure to delete this question?")
    if (ans) {
      try {
        const questionId = e.target.name
        const res = await axios.delete(`${url}/deleteQuestion/${adminId}/${questionId}`, { headers: { token: token } })
        toast.success("Question Successfully Deleted")
        setRender(!render)
      }
      catch (err) {
        toast.error(err.response.data.message)
      }
    }
  }

  const allQuestionsData = async (adminId, quizId) => {
    try {
      const res = await axios.get(`${url}/getQuestions/${adminId}/${quizId}`, { headers: { token: token } })
      const questionsList = res.data.data
      if (questionsList.length == 10) {
        setAllQuestions(questionsList)
        setShow(true)
        setShowAddQuestion(false)
        setBtnParticipants(true)
      }
      else if (questionsList.length != 0) {
        setAllQuestions(questionsList)
        setShow(true)
        setShowAddQuestion(true)
        setBtnParticipants(false)
      } else if (questionsList.length == 0) {
        setShow(false)
      }
    }
    catch (err) {
      toast.error(err.response.data.message)
    }
  }

  const addParticipants = (e)=>{
    navigator(`/addParticipants/${adminId}/${quizId}`)
  }

  useEffect(() => {
    allQuestionsData(adminId, quizId)
  }, [render])

  return (

    <div>
      <div>
        {show ? (
          <div>
            {
              allQuestions.map((i) => (
                <div class="container mt-sm-2 my-1">
                  <div class="question ml-sm-5 pl-sm-5 pt-2">
                    <div>
                      <div className="py-2 h5"><b>{`Q. ${i.questionText}`}</b></div>
                      <div class="ml-md-3 ml-sm-3 pl-md-5 pt-sm-0 pt-3" id="options">
                        {i.options.map((j) => (
                          <label class="options">{`${j.value}`}</label>
                        ))}
                      </div>
                      <div className='d-flex'>
                        <h6 className='me-2'>Difficulty Level: <span className='text-warning pe-2 p-2'>{i.difficulty}</span></h6>
                        <h6 className='text-end'>Correct Option/Options : {i.correctOption.map((k) => (<span className='text-warning pe-2 p-2'>{k}</span>))}</h6>
                      </div>
                    </div>

                  </div>
                  <div class="d-flex align-items-center pt-3">
                    <div class="ml-auto mr-sm-5">
                      <button class="btn btn-success" name={i._id} onClick={(e) => deleteQuestion(e)}>Delete</button>
                    </div>
                  </div>
                </div>
              ))
            }
          </div>
        ) : (
          ''
        )
        }
      </div>

      {
        showAddQuestion ? (
          <div class="container mt-sm-1 my-1 p-5">
            <div class="question ml-sm-5 pl-sm-5 pt-2">
              <div className='pb-3'>
                <h6 className='m-2'>Difficulty Level :  <span className='text-warning'>{question.difficulty} </span> </h6>
                <div className="d-flex flex-wrap">
                  {
                    array.map((i) => (
                      <button className='button' name={`${i}`} onClick={(e) => difficulty(e)}>{i}</button>
                    ))
                  }
                </div>
              </div>
              <div className='pb-3'>
                <h6 className='m-2'>More Than One is Correct : <span className='text-warning'>{question.moreThanOneCorrect}</span></h6>
                <div className="d-flex m-4">
                  <button className='button' name="True" onClick={(e) => moreThanOneCorrect(e)}>True</button>
                  <button className='button' name="False" onClick={(e) => moreThanOneCorrect(e)}>False</button>
                </div>
              </div>
              <div class="py-2 d-flex ">
                <textarea className='w-100' placeholder='Write our question.....' name="questionText" value={question.questionText} onChange={(e) => questionData(e)} />
              </div>
              <div class="ml-md-3 ml-sm-3 pl-md-5 pt-sm-0 pt-3" id="options">
                {
                  option.map((i) => (
                    <label className="options d-flex">
                      <h6 className='pe-3'>{`${i}. `}</h6>
                      <textarea className='w-100' type="text" placeholder={`Option ${i}`} name={`opt${i}`} value={question[`opt${i}`]} onChange={(e) => questionData(e)} />
                      <button className='ms-3' name={`${i}`} onClick={(e) => isCorrect(e)}>Is Correct</button>
                    </label>
                  ))
                }
              </div>
              <h6>Correct Option/Options : {question.correctOption.map((i) => (<span className='text-warning pe-2 p-2'>{i}</span>))}</h6>
            </div>

            <div className="ml-auto mr-sm-5 m-4">
              <button className="btn btn-success" onClick={(e) => addQuestion(e)}>Add Question</button>
            </div>
          </div>
        ) : (
          ''
        )
      }
      {
        btnParticipants ? <button className='btn btn-primary btn-lg float-end m-5' onClick={(e)=>addParticipants(e)} >Add Participants</button> : ""
      }


    </div>
  )
}

export default AddQuestions
