import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { Toaster } from "react-hot-toast"
import AdminLogin from "./components/adminLogin"
import AdminPanel from "./components/adminPanel"
import AddAdmin from "./components/addAdmin"
import AddQuestions from "./components/addQuestions"
import AddParticipants from "./components/addParticipants"
import ParticipantLogin from "./components/participantLogin"
import QuizPage from "./components/quizPage"
import NavBar from "./components/navBar"

function App() {

 return (
  <Router>
    {/* <NavBar/> */}
    <Routes>
      <Route path="/" element={<div><NavBar/> <AdminPanel/></div>}/>
      <Route path="/adminLogin" element={<AdminLogin/>}/>
      <Route path="/addAdmin/:adminId" element={<AddAdmin/>}/>
      <Route path="/addQuestions/:adminId/:quizId" element={<AddQuestions />}/>
      <Route path="/addParticipants/:adminId/:quizId" element={<AddParticipants />}/>
      <Route path="/participantLogin/:quizId" element={<ParticipantLogin />}/>
      <Route path="/quizPage/:quizId" element={<QuizPage />}/>
    </Routes>
    <Toaster/>
  </Router>
 )
}

// const DynamicLayoutRoute = props => {
//   const { component: RoutedComponent, layout, ...rest } = props;

//   // render actual Route from react-router
//   const actualRouteComponent = (
//     <Route
//       {...rest}
//       render={props => (
//          <RoutedComponent {...props} />
//       )}
//     />
//   );

//   // depends on the layout, you can wrap Route component in different layouts
//   switch (layout) {
//     case 'NAV': {
//       return (
//         <LayoutNav>
//           {actualRouteComponent}
//         </LayoutNav>
//       )
//     }
//     case 'DASH_BOARD_NAV': {
//       return (
//         <LayoutDashboardNav>
//           {actualRouteComponent}
//         </LayoutDashboardNav>
//       )
//     }
//     default: {
//       return (
//         <LayoutNav>
//           {actualRouteComponent}
//         </LayoutNav>
//       )
//     }
//   }
// };

export default App
