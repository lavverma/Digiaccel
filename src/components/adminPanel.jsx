import React, { useEffect, useState } from 'react'
import jwt from "jwt-decode"
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import axios from 'axios';

const url = import.meta.env.VITE_SERVER_URL

const AdminPanel = () => {
    const navigate = useNavigate()
    const [fname, setFname]  =useState("")
    const [quizName, setQuizName] = useState("")
    const [token, setToken] = useState('')
    const [adminId, setAdminId ] = useState("")
    useEffect(()=>{
        if(document.cookie == "" ){
            navigate("/adminLogin")
        }
        if(document.cookie.slice(0,3) !== 'JWT'){
            navigate("/adminLogin")
        }else{
            const token = document.cookie.slice(4)
            setToken(token)
            const adminId = jwt(token).adminId
            setAdminId(adminId)
            adminPanel(token)
        }
    },[])
    

    const quiz = (e) => {
        setQuizName(e.target.value)
    }

    const addQuiz = async () => {
        try{
        if (quizName == "") {
          return  toast.error("Please give Quiz name")
        }
        const res = await axios.post(`${url}/addQuiz/${adminId}`,{quizName : quizName}, {headers : {token : token}})
        const quizId = res.data.data._id
        navigate(`/addQuestions/${adminId}/${quizId}`)
       }
       catch (err) {
        toast.error(err.response.data.message)
    }
    }


    const addAdmin = async () => {
        navigate(`/addAdmin/${adminId}`)
    }



    const adminPanel = async (token)=>{
        try{
          const res = await axios.get(`${url}/adminPanel`, {headers : {token : token}})
          setFname(res.data.data.fname);
        }
        catch (err) {
            toast.error(err.response.data.message)
        }
    }

  

    return (
        <div className="vh-100" style={{ "background-color": "#55b4b0" }}>
            <h2 className='mb-5 text-center'>{`Welcome Back..${fname}`}</h2>
            <button type="button" className="btn btn-primary btn-m m-5 float-end" onClick={(e) => addAdmin(e)}>Add New Admin</button>
            {/* <button type="button" className="btn btn-primary btn-m m-5 float-end" onClick={(e) => addCandidate(e)}>Register Candidate</button> */}
            <h2 >Create A New Quiz</h2>
            <div className="input-group mt-5 w-75">
                <input type="text" className="form-control me-4 ms-4" placeholder="Quiz Name..." aria-label="Quiz Name..." aria-describedby="button-addon2" value={quizName} onChange={(e) => quiz(e)} />
                <button className="btn btn-outline-success fw-bold " type="button" id="button-addon2" onClick={(e) => addQuiz(e)}>Add Quiz</button>
            </div>
        </div>
    )
}

export default AdminPanel