import React, { useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import styles from "./Navbar.module.css"; // Import CSS Module

function Navbar(props) {
  const name = localStorage.getItem("name");
  const navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      navigate("/");
    }
  }, [navigate]);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("useremail");
    navigate("/");
  };

  return (
    <>
      <div className={styles.navbar}>
        <div className={styles.navfirst}>
          <ul className={styles.ul}>
            <NavLink
              to={"/user"}
              style={{
                textDecorationLine: "none",
                textUnderlineOffset: "none",
              }}
            >
              <li className={`${styles.li} ${styles.name}`}>PhotoCloud</li>
            </NavLink>
          </ul>
        </div>

        <div className={styles.navsecond}>
          <ul className={styles.navsecondul}>
            <div className={styles.username}>{name}</div>
            <button className={`${styles.btn} ${styles.buttonlogin}`} onClick={logout}>
              Logout
            </button>
          </ul>
        </div>
      </div>
    </>
  );
}

export default Navbar;
