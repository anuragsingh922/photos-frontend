import React, { useEffect } from 'react'
// import React, { useState } from 'react'
import './Navbar.css'
import {Link, NavLink} from 'react-router-dom'
import { useNavigate } from 'react-router-dom'

function Navbar(props) {

  // const leave = ()=>{
  //     const arrow = document.getElementById('arrowicon');

  //     arrow.animate([
  //         { transform: 'rotate(180deg)'},
  //         { transform: 'rotate(0deg)'}
  // ], {
  //   duration: 1000/2,
  //       }
  //     )
  // }


  const user_name = localStorage.getItem("username");
  const userlastname = localStorage.getItem("userlastname");

  const navigate = useNavigate();

  useEffect(()=>{
    if(!localStorage.getItem("token")){
      navigate("/");
    }
  })



  const logout = ()=>{
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("useremail");
    navigate("/");
  }


  return (<>
    <div className="navbar">
      <div className="navfirst">
        <ul className="ul">
            <Link to="/user"><li className="li name" >Photos</li></Link>
        </ul>
      </div>


      <div className="navsecond">
        <ul className="navsecondul">
            <div className="username">{user_name + " " + userlastname}</div>
            <button className='btn buttonlogin' onClick={logout}>Logout</button>
        </ul>
      </div>
      </div>
      </>
  )
}

export default Navbar
