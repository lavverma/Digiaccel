import React, { useState, useEffect } from 'react'
import jwt from "jwt-decode"
import { toast } from 'react-hot-toast';
import axios from 'axios';
import { useParams , useNavigate} from 'react-router-dom';

const url = import.meta.env.VITE_SERVER_URL

const QuizPage = () => {
    const navigate = useNavigate()
    const {quizId}  = useParams()
    const [show, setShow] = useState(true)
    const [question, setQuestion ] = useState({})
    const [questionId, setQuestionId] = useState("")
    const [difficulty, setDifficulty] = useState(5)
    const [options, setOptions] = useState([])
    const [chooseOption, setChooseOption] = useState([])
    const [token, setToken] = useState('')
    const [participantId, setParticipantId ] = useState("")
    useEffect(()=>{
        if(document.cookie == "" ){
            navigate(`/participantlogin/${quizId}`)
        }
        if(document.cookie.slice(0,4) !== 'JWTP'){
            navigate(`/participantlogin/${quizId}`)
        }else{
            const token = document.cookie.slice(5)
            setToken(token)
            const participantId = jwt(token).participantId
            setParticipantId(participantId)
        }
    },[])

    const startQuiz = (e)=>{
        e.preventDefault()
        setShow(false)
        quizStart(quizId, participantId, token)
    }

    const quizStart  = async(quizId, participantId, token)=>{
        try{
            const res = await axios.get(`${url}/getQuestion/${participantId}/${quizId}` , {headers : {token : token}})
            const data = res.data.data
            setQuestion(data)
            setQuestionId(data._id)
            setDifficulty(data.difficulty)
            setOptions(data.options)
        }
        catch (err) {
            toast.error(err.response.data.message)
        }
    }

    const selectedOption = (e)=>{
        let curr = e.target.name.slice(5)
        if(chooseOption.length < 5){
            let idx = chooseOption.indexOf((curr))
            if (idx == -1) {
                setChooseOption((
                  [...chooseOption, curr]
                ))
        }
        else{
            let arr = [...chooseOption]
            arr.splice(idx, 1)
            setChooseOption(arr)
        }
    }
}

const sendResponse = async()=>{
    try{
  const res = await axios.put(`${url}/response/${participantId}/${quizId}`,{questionId : questionId, difficulty: difficulty, chooseOption : chooseOption}, {headers : {token : token}})
    }
    catch (err) {
        toast.error(err.response.data.message)
    }
}

  return (
    <div className="container mt-sm-5 my-1">
       {
        show ?  <button className='btn btn-primary' onClick={(e)=>startQuiz(e)}>Quiz Start</button> :
        <div>
    <div className="question ml-sm-5 pl-sm-5 pt-2">
        <div className="py-2 h5"><b>Q. {question.questionText}</b></div>
        <h6 className='me-2'>Difficulty Level: <span className='text-warning pe-2 p-2'>{question.difficulty}</span></h6>
        <h6 className='m-3'>More Than One Correct: <span className='text-warning pe-2 p-2'>{`${question.moreThanOneCorrect}`}</span></h6>
        <div className="ml-md-3 ml-sm-3 pl-md-5 pt-sm-0 pt-3" id="options">
            {
                options.map((i,index)=>(
                    <label className="options">{i.value}
                <input type="radio" name={`radio${index+1}`} onClick={(e)=>selectedOption(e)}/>
                <span className="checkmark"></span>
            </label>
                ))
            }
        </div>
    </div>
    <h6>Correct Option/Options : {chooseOption.map((i) => (<span className='text-warning pe-2 p-2'>{i}</span>))}</h6>
    <div className="d-flex align-items-center pt-3">
        <div className="ml-auto mr-sm-5">
            <button className="btn btn-success" onClick={(e)=>sendResponse(e)}>Ok</button>
        </div>
    </div>
    </div>
}
</div>
  )
}

export default QuizPage