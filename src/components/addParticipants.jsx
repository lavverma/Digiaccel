import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { toast } from 'react-hot-toast'
import { useParams } from 'react-router-dom'

const url = import.meta.env.VITE_SERVER_URL

const AddParticipants = () => {
    const { quizId, adminId } = useParams()
    const [details, setDetails] = useState({
        fname: "",
        lname: '',
        email: ''
    })
    const [participantData, setParticipantData] = useState([])
    const [quizLink, setQuizLink] = useState("")
    const [show, setShow] = useState(true)
    const [render, setRender] = useState(false)
    const participants = (e) => {
        const { name, value } = e.target
        setDetails({
            ...details,
            [name]: value
        })
    }

    const token = document.cookie.slice(4)
    const createParticipant = async (e) => {
        try {
            const res = await axios.post(`${url}/createParticipant/${adminId}/${quizId}`, details, { headers: { token: token } })
            toast.success("Participant has been Added")
            setRender(!render)
        }
        catch (err) {
            toast.error(err.response.data.message)
        }
    }

    const getParticipant = async (adminId, quizId) => {
        try {
            const res = await axios.get(`${url}/getParticipant/${adminId}/${quizId}`, { headers: { token: token } })
            setParticipantData(res.data.data)
            setShow(true)
        }
        catch (err) {
            let error = err.response.data.message
            if (error == "No participant found") {
                setShow(false)
                return
            }
            toast.error(error)
        }

    }

    const getLink = async (adminId, quizId)=>{
        try {
            const res = await axios.get(`${url}/quizLink/${adminId}/${quizId}`, { headers: { token: token } })
            setQuizLink(res.data.data)
        }
        catch (err) {
            toast.error(err.response.data.message)
        }
    }

    useEffect(() => {
        getParticipant(adminId, quizId)
    }, [render])

    useEffect(()=>{
        getLink(adminId, quizId)
    },[])

    const deleteParticipant = async (e) => {
        let ans = window.confirm("You are sure to delete this Participant?")
        if (ans) {
            try {
                const participantId = e.target.name
                await axios.delete(`${url}/deleteParticipant/${adminId}/${participantId}`, { headers: { token: token } })
                toast.success("Participant Deleted")
                setRender(!render)
            }
            catch (err) {
                toast.error(err.response.data.message)
            }
        }
    }
    return (
        <div>
            <section className="h-100 bg-dark">
                <div className="container py-5 h-100">
                    <div className="row d-flex justify-content-center align-items-center h-100">
                        <div className="col">
                            <div className="card card-registration my-4">
                                <div className="row g-0">
                                    <div className='m-1'>
                                        <input className='w-50 me-1' value={quizLink}/>
                                        {/* <button className='btn btn-primary p-1'>Copy Quiz Link</button> */}
                                    </div>
                                    {
                                        show ? (
                                            <div className="col-xl-6  p-4 bg-dark">
                                                {participantData.map((i) => (
                                                    <div className='d-flex'>
                                                        <h6 className='me-1'>{i.fname}</h6>
                                                        <h6 className='me-5'>{i.lname}</h6>
                                                        <h6 className='w-50'>{i.email}</h6>
                                                        <button className=' btn-primary mb-1 pe-1 ps-1 float-end' name={i._id} onClick={(e) => deleteParticipant(e)}>D</button>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : ""
                                    }
                                    <div className="col-xl-6">
                                        <div className="card-body p-md-5 text-black">
                                            <h3 className="mb-5 text-uppercase">Participant registration form</h3>

                                            <div className="row">
                                                <div className="col-md-6 mb-4">
                                                    <div className="form-outline">
                                                        <input type="text" id="form3Example1m" className="form-control form-control-lg" name='fname' value={details.fname} onChange={(e) => participants(e)} />
                                                        <label className="form-label" for="form3Example1m">First name</label>
                                                    </div>
                                                </div>
                                                <div className="col-md-6 mb-4">
                                                    <div className="form-outline">
                                                        <input type="text" id="form3Example1n" className="form-control form-control-lg" name='lname' value={details.lname} onChange={(e) => participants(e)} />
                                                        <label className="form-label" for="form3Example1n">Last name</label>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="form-outline mb-4">
                                                <input type="text" id="form3Example97" className="form-control form-control-lg" name='email' value={details.email} onChange={(e) => participants(e)} />
                                                <label className="form-label" for="form3Example97">Email ID</label>
                                            </div>

                                            <div className="d-flex justify-content-end pt-3">
                                                <button type="button" className="btn btn-warning btn-lg ms-2" onClick={(e) => createParticipant(e)}>Add</button>
                                            </div>

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

export default AddParticipants