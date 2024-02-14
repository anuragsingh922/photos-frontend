import { useEffect, useState } from 'react';
import Main from './Components/Main';
import Navbar from './Components/Navbar';
import UserNavbar from './Components/UserNavbar';
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import Alert from './Components/Alert';
import Login from './Components/Login';
import Signup from './Components/Signup';
import Home from './Components/Home';

function App() {

  const[alert,setalert] = useState(null);

  const showalert = (message,type)=>{
    setalert({
    message : message,
    type : type
  })
  setTimeout(() => {
    setalert(null);
  }, 1500);
}


  return (
    <>
    <Router>
      <Routes>
        <Route exact  path="/" element={<><Navbar/><Home/></>} />
        <Route exact  path="/user" element={<><UserNavbar/><Main showalert={showalert}/></>} />
        <Route exact  path="/login" element={<><Alert alert={alert}/><Login showalert= {showalert}/></>} />
      <Route exact  path="/signup" element={<><Alert alert={alert}/><Signup showalert={showalert}/></>} />
      </Routes>
    </Router>
    </>
  );
}

export default App;
