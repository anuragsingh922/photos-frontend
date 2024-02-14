import React, { useState} from 'react';
import './Signup.css'
import {Link} from 'react-router-dom'
import { useNavigate } from 'react-router-dom';
// const axios = require("axios");


function Signup(props) {



  const [signupdata , setsigndata] = useState({fname: "" , lname: "" , email: "" , password: "" , phone: ""})

  const navigate = useNavigate();

  const submit = async(e)=>{
    e.preventDefault();
    const responce = await fetch("http://localhost:8080/api/auth/signup",{
      method:'POST',
      headers : {
        'Content-Type' : 'application/json'
      },

      body : JSON.stringify({fname:signupdata.fname , lname:signupdata.lname , email: signupdata.email , password: signupdata.password , phone: signupdata.phone})

  });

  const json = await responce.json()
  console.log(json);

  if(json.success){
    localStorage.setItem('token' , json.authtoken)
    navigate('/login');
    props.showalert("Sign Up Successfully " , 'success');
  }
  else{
    props.showalert("Check Details Again" , 'Error')
  }

  }

  const onChange = (e)=>{
    setsigndata({...signupdata , [e.target.name] : e.target.value});
  }

  return (
    <div className='main'>
    <div className="first">
    <div className="logo"><Link to='/' className='logolink'>Zomato Blinkit</Link></div>
      <div className="heading">Registration</div>
      <div className="formdiv">


        <form className="form" onSubmit={submit} >
          <input type="text" className="namein" id='fname' name='fname' placeholder='First Name'  onChange={onChange} />
          <input type="text" className="namein" id='lname' name='lname' placeholder='Last Name'  onChange={onChange} /><br /><br></br>
          <input type="email" className="email" id='email' name='email' placeholder='Email' onChange={onChange} /><br />
          <input type="password" id='password' name='password' className="password" placeholder='Password' onChange={onChange}/> 
          <input type="password" id='cpassword' name='cpassword' className="password" placeholder='Confirm Password' onChange={onChange}/>
          <br></br>
          <br></br>
          <input type="number" className="namein" id='phone' name='phone' placeholder='Phone Number' onChange={onChange} />
          
          <button className='signupbutton' type="submit">Sign Up</button>
        </form>
      </div>
    </div>

    <div className="second">
      
      <h2 className="subhead">Already have a account</h2>
      <Link to='/login'><div className='loginbuttondiv'>Login</div></Link>
    </div>
  </div>
  )
}

export default Signup