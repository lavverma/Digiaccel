import React from 'react'
import { toast } from 'react-hot-toast'
import { useCookies } from 'react-cookie';
import { Link , useNavigate} from 'react-router-dom'
import "../styles/navBar.css"
const NavBar = () => {
    const navigate  = useNavigate()
    const [cookies, setCookie, removeCookie] = useCookies(['JWT']);

    const logOut = (e)=>{
        let ans = window.confirm("You are sure to Logout?")
        if(ans){
            removeCookie('JWT')
            toast.success("You are successfully logout")
            navigate("/adminLogin")
        }
    }

  return (
    <nav className="navbar navbar-default bg-danger">
    <div className='container-fluid  d-flex justify-content-between p-1'>
          <img className='img ' src='https://img.freepik.com/premium-vector/quiz-logo-isolate-white-questionnaire-icon-poll-sign-flat-bubble-speech-symbol_185004-212.jpg?w=2000' />
 <div className=''>
 <Link to={"/addAdmin/:adminId"} className="btn text-decoration-none font-weight-bolder text-light btn-primary p-2 me-5">
   Add Admin
   </Link>
   <button className='btn m-2 p-1 me-5 ms-5 btn-warning' onClick={(e)=>logOut(e)}>Logout</button>
 </div>
    </div>
    </nav>
  )
}

export default NavBar