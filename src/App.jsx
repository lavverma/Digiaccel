import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { Toaster } from "react-hot-toast"
import AdminLogin from "./components/adminLogin"
import AdminPanel from "./components/adminPanel"
import AddAdmin from "./components/addAdmin"
import AddQuestions from "./components/addQuestions"
import AddParticipants from "./components/addParticipants"
import ParticipantLogin from "./components/participantLogin"
import QuizPage from "./components/quizPage"

function App() {

 return (
  <Router>
    <Routes>
      <Route path="/" element={<AdminPanel/>}/>
      <Route path="/adminLogin" element={<AdminLogin/>}/>
      <Route path="/addAdmin/:adminId" element={<AddAdmin/>}/>
      <Route path="/addQuestions/:adminId/:quizId" element={<AddQuestions />}/>
      <Route path="/addParticipants/:adminId/:quizId" element={<AddParticipants />}/>
      <Route path="/participantlogin/:quizId" element={<ParticipantLogin />}/>
      <Route path="/quizPage/:quizId" element={<QuizPage />}/>
    </Routes>
    <Toaster/>
  </Router>
 )
}

export default App
