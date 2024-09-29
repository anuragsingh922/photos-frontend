import { useEffect, useState } from "react";
import Main from "./Components/Main";
import Navbar from "./Components/Navbar";
import UserNavbar from "./Components/UserNavbar";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Alert from "./Components/Alert";
import Login from "./Components/Login";
// import Signup from "./Components/Signup";
import Home from "./Components/Home";
import Signin from "./Components/Auth/Signin";
import Signup from "./Components/Auth/Signup";
import View from "./Components/View/View";
import NotFound from "./Components/404/NotFound";
import ContactUs from "./Components/ContactUs/ContactUs";
import ViewS from "./Components/View/ServerSideUploading";

function App() {
  const [alert, setalert] = useState(null);

  const showalert = (message, type) => {
    setalert({
      message: message,
      type: type,
    });
    setTimeout(() => {
      setalert(null);
    }, 1500);
  };

  return (
    <>
      <Router>
        <Routes>
          <Route
            exact
            path="/"
            element={
              <>
                <Navbar />
                <Home />
              </>
            }
          />
          <Route
            exact
            path="/stream"
            element={
              <>
                <UserNavbar />
                {/* <Main showalert={showalert} /> */}
                <View showalert={showalert} />
              </>
            }
          />
          <Route
            exact
            path="/server"
            element={
              <>
                <UserNavbar />
                {/* <Main showalert={showalert} /> */}
                <ViewS showalert={showalert} />
              </>
            }
          />
          <Route
            exact
            path="/login"
            element={
              <>
                <Alert alert={alert} />
                {/* <Login showalert={showalert} /> */}
                <Signin showalert={showalert} />
              </>
            }
          />
          <Route
            exact
            path="/signup"
            element={
              <>
                <Alert alert={alert} />
                <Signup showalert={showalert} />
              </>
            }
          />
          <Route
            exact
            path="/contactus"
            element={
              <ContactUs/>
            }
          ></Route>
          <Route
            exact
            path="/*"
            element={
              <NotFound/>
            }
          ></Route>
          
        </Routes>
      </Router>
    </>
  );
}

export default App;
