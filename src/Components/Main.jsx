import React, { useEffect, useState } from "react";
import "./Main.css";
import { Link } from "react-router-dom";

function Main() {
  const [data, setdata] = useState({ location: "" });

  const [text, setText] = useState('');
  const [index, setIndex] = useState(0);

  const onChange = (e) => {
    setdata({ ...data, [e.target.name]: e.target.value });
  };


  useEffect(() => {
    const textToType = "Discover the closest e-waste disposal sites near you.";
    if (index < textToType.length) {
      setTimeout(() => {
        setText(textToType.slice(0, index + 1));
        setIndex(index + 1);
      }, 50);
    }
  }, [index]);
  


  

  return (
    <>
      <div className="back">

        
      </div>
      <footer>© Sudhanshu </footer>

    </>
  );
}

export default Main;
