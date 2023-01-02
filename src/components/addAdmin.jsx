import React, { useState } from 'react'
import toast  from "react-hot-toast"
import axios from "axios"
import { useNavigate } from 'react-router-dom';
import jwt from "jwt-decode"


const url = import.meta.env.VITE_SERVER_URL

const addAdmin = () => {
    const navigate = useNavigate()
    const [details, setDetails] = useState({
        fname : "" ,
        lname : "",
        email: "",
        password: ""
    })


    const adminData = (e) => {
        const { name, value } = e.target

        setDetails({
            ...details,
            [name]: value
        })
    }

    const token  = document.cookie.slice(4)
  const adminId = jwt(token).adminId
    const addAdmin = async (e) => {
        e.preventDefault()
        try {
            const res = await axios.post(`${url}/addAdmin/${adminId}`, details, {headers : {token : token}})
            toast.success("New Admin Successfully Added")
            navigate("/")
        }
        catch (err) {
            toast.error(err.response.data.message)
        }
    }

    return (
        <div className="App">
            <section className="vh-100" style={{ "background-color": "#9A616D" }}>
                <div className="container py-5 h-100">
                    <div className="row d-flex justify-content-center align-items-center h-100">
                        <div className="col col-xl-10">
                            <div className="card" style={{ "border-radius": "1rem" }}>
                                <div className="row g-0">
                                    <div className="col-md-6 col-lg-5 d-none d-md-block">
                                        <img src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/img1.webp"
                                            alt="login form" className="img-fluid" style={{ "border-radius": "1rem 0 0 1rem" }} />
                                    </div>
                                    <div className="col-md-6 col-lg-7 d-flex align-items-center">
                                        <div className="card-body p-4 p-lg-5 text-black">

                                            <form>

                                                {/* <div className="d-flex align-items-center mb-3 pb-1">
                        <i className="fas fa-cubes fa-2x me-3" style={{"color": "#ff6219"}}></i>
                        <span className="h1 fw-bold mb-0">Logo</span>
                      </div> */}

                                                {/* <h5 className="fw-normal mb-3 pb-3" style={{ "letter-spacing": "1px;" }}>Sign into your account</h5> */}

                                               <div className='d-flex'>
                                               <div className="form-outline mb-4 me-3">
                                                    <input type="text" id="form2Example17" className="form-control form-control-lg" name="fname" value={details.fname} onChange={(e) => adminData(e)} />
                                                    <label className="form-label" for="form2Example17">First Name</label>
                                                </div>

                                                <div className="form-outline mb-4 ">
                                                    <input type="text" id="form2Example17" className="form-control form-control-lg" name="lname" value={details.lname} onChange={(e) => adminData(e)} />
                                                    <label className="form-label" for="form2Example17">Last Name</label>
                                                </div>
                                               </div>

                                                <div className="form-outline mb-4">
                                                    <input type="email" id="form2Example17" className="form-control form-control-lg" name="email" value={details.email} onChange={(e) => adminData(e)} />
                                                    <label className="form-label" for="form2Example17">Email address</label>
                                                </div>

                                                <div className="form-outline mb-4">
                                                    <input type="password" id="form2Example27" className="form-control form-control-lg" name="password" value={details.password} onChange={(e) => adminData(e)} />
                                                    <label className="form-label" for="form2Example27">Password</label>
                                                </div>

                                                <div className="pt-1 mb-4">
                                                    <button className="btn btn-dark btn-lg btn-block" type="button" onClick={(e) => addAdmin(e)}>Add New Admin</button>
                                                </div>

                                                {/* <a className="small text-muted" href="#!">Forgot password?</a>
                      <p className="mb-5 pb-lg-2" style={{"color": "#393f81"}}>Don't have an account? <a href="#!"
                          style={{"color": "#393f81"}}>Register here</a></p>
                      <a href="#!" className="small text-muted">Terms of use.</a>
                      <a href="#!" className="small text-muted">Privacy policy</a> */}
                                            </form>

                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

        </div>
    )
}

export default addAdmin