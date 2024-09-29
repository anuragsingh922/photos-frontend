import { useState } from "react";
import { useNavigate } from 'react-router-dom'

export default function Signin(props) {

    const [logindata , setlogindata] = useState({email: "" , password: ""})

  const navigate = useNavigate();

  const submit = async(e)=>{
    try{
    e.preventDefault();

    console.log(logindata);
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
        navigate("/server");
        props.showalert("Login Successfully" , 'success');
        // e.sendStatus(200);
    }
    else{
      props.showalert("Invalid Usename or passsword" , 'danger');
    }
  }catch(err){
    console.log("Error during login ", err);
  }

  }


  const onChange = (e)=>{
    setlogindata({...logindata , [e.target.name] : e.target.value});
  }
    return (
      <>
        <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
          <div className="sm:mx-auto sm:w-full sm:max-w-sm">
            <img
              alt="Your Company"
              src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
              className="mx-auto h-10 w-auto"
            />
            <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
              Sign in to your account
            </h2>
          </div>
  
          <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
            <form action="#" method="POST" className="space-y-6" onSubmit={submit}>
              <div>
                <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                  Email address
                </label>
                <div className="mt-2">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    onChange={onChange}
                    required
                    autoComplete="email"
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>
  
              <div>
                <div className="flex items-center justify-between">
                  <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
                    Password
                  </label>
                </div>
                <div className="mt-2">
                  <input
                    id="password"
                    onChange={onChange}
                    name="password"
                    type="password"
                    required
                    autoComplete="current-password"
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>
  
              <div>
                <button
                  type="submit"
                  className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  Sign in
                </button>
              </div>
            </form>
          </div>
        </div>
      </>
    )
  }
  