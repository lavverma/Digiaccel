import axios from 'axios'
import React, {  useState } from 'react'
import { toast } from 'react-hot-toast'
import { useCookies } from 'react-cookie';
import { useNavigate, useParams } from 'react-router-dom';

const url = import.meta.env.VITE_SERVER_URL
const ParticipantLogin = () => {
    const [ details, setDetails] = useState({
        name : "",
        email : ""
    })

    const [cookies, setCookie] = useCookies(['JWTP']);
    const navigate = useNavigate()
    const {quizId}  = useParams()

const data = (e)=>{
    const {name, value} = e.target
    setDetails({
       ...details,
       [name] : value
    })
} 

const login = async (e)=>{
try{
  const res = await axios.post(`${url}/participantLogin`, details)
  setCookie('JWTP', res.data.data, { path: '/' , maxAge:60*60*24*2});
  toast.success("Best Of Luck")
  navigate(`/quizPage/${quizId}`)
}
catch (err) {
    toast.error(err.response.data.message)
}
}

  return (
    <section className="vh-100" style={{"background-color": "#eee"}}>
  <div className="container h-100">
    <div className="row d-flex justify-content-center align-items-center h-100">
      <div className="col-lg-12 col-xl-11">
        <div className="card text-black" style={{"border-radius": "25px"}}>
          <div className="card-body p-md-5">
            <div className="row justify-content-center">
              <div className="col-md-10 col-lg-6 col-xl-5 order-2 order-lg-1">

                <p className="text-center h1 fw-bold mb-5 mx-1 mx-md-4 mt-4">Sign up</p>

                <form className="mx-1 mx-md-4">

                  <div className="d-flex flex-row align-items-center mb-4">
                    <i className="fas fa-user fa-lg me-3 fa-fw"></i>
                    <div className="form-outline flex-fill mb-0">
                      <input type="text" id="form3Example1c" className="form-control" name='name' value={details.name} onChange={(e)=>data(e)}/>
                      <label className="form-label" for="form3Example1c">Your Name</label>
                    </div>
                  </div>

                  <div className="d-flex flex-row align-items-center mb-4">
                    <i className="fas fa-envelope fa-lg me-3 fa-fw"></i>
                    <div className="form-outline flex-fill mb-0">
                      <input type="email" id="form3Example3c" className="form-control" name='email' value={details.email} onChange={(e)=>data(e)}/>
                      <label className="form-label" for="form3Example3c">Your Email</label>
                    </div>
                  </div>

                  <div className="d-flex justify-content-center mx-4 mb-3 mb-lg-4">
                    <button type="button" className="btn btn-primary btn-lg" onClick={(e)=>login(e)}>Enter In Quiz</button>
                  </div>

                </form>

              </div>
              <div className="col-md-10 col-lg-6 col-xl-7 d-flex align-items-center order-1 order-lg-2">

                <img src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-registration/draw1.webp"
                  className="img-fluid" alt="Sample image"/>

              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>
  )
}

export default ParticipantLogin