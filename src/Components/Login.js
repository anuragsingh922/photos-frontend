import React, { useState } from 'react'
import './Signup.css'
import {Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'

function Login(props) {

  const [logindata , setlogindata] = useState({email: "" , password: ""})

  const navigate = useNavigate();

  const submit = async(e)=>{
    e.preventDefault();
    const responce = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/auth/login`,{
        method: 'POST',
        headers : {
        "Accept": "application/json",
        'Content-Type' : 'application/json',
        "Allow-cross-origin" : "*",
      },

      body : JSON.stringify({email: logindata.email , password : logindata.password})
  });

  const json = await responce.json();

    if(json.success){
        localStorage.setItem('token' , json.authtoken);
        localStorage.setItem('username' , json.user.fname);
        localStorage.setItem('userlastname' , json.user.lname);
        localStorage.setItem('useremail' , json.user.email);
        navigate("/user");
        props.showalert("Login Successfully" , 'success');
        // e.sendStatus(200);
    }
    else{
      props.showalert("Invalid Usename or passsword" , 'danger');
    }

  }


  const onChange = (e)=>{
    setlogindata({...logindata , [e.target.name] : e.target.value});
  }




  return (
    <div className='main'>
      <div className="first">
      <div className="logo"><Link to='/' className='logolink'>E-PARAS</Link></div>
        <div className="heading">Welcome, Login to your account</div>
        <div className="formdiv">


          <form onSubmit={submit} >
            <input type="email" id='email' className="email" name='email' onChange={onChange} value={logindata.email} placeholder='Email' /><br />
            <input type="text" id='password' className="password" name='password' onChange={onChange} value={logindata.password} placeholder='Password' /><br/><br/>
            <button className='loginbuttondiv'  type="submit" >Login</button>
          </form>


        </div>
      </div>

      <div className="second">
        <div className="secondheading">New User! Create a new account here <br/> <br />
        </div>
        <Link to='/signup'><div className='loginbuttondiv'>Signup</div></Link>
      </div>
    </div>
  )
}

export default Login