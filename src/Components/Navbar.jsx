import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import styles from "./Navbar.module.css";  // Import CSS Module

function Navbar(props) {
  const navigate = useNavigate();

  return (
    <>
      <div className={styles.navbar}>
        <div className={styles.navfirst}>
          <ul className={styles.ul}>
            {/* <NavLink to={localStorage.getItem("token") ? "/user" : "/"} style={{ textDecoration: "none" }}><li className="li name" style={{ textDecoration: "none" }}>Photos</li></NavLink> */}
            <li className={styles.li}>PhotoCloud</li>
          </ul>
        </div>

        <div className={styles.navsecond}>
          <ul className={styles.navsecondul}>
            <NavLink to="/login" className={styles.link}>
              <button className={styles.buttonlogin}>Login</button>
            </NavLink>
            <NavLink to="/signup">
              <button className={styles.buttonsign}>Sign Up</button>
            </NavLink>
          </ul>
        </div>
      </div>
    </>
  );
}

export default Navbar;
