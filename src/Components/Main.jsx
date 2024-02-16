import React, { useEffect, useState } from "react";
import "./Main.css";
import { Link } from "react-router-dom";
import axios from 'axios';

function Main() {
  const [fname, setfname] = useState(localStorage.getItem('username'));
  const [lname, setlname] = useState(localStorage.getItem('userlastname'));
  const [email, setemail] = useState(localStorage.getItem('useremail'));
  const [isimage, setisimage] = useState(null);

  const [images , setImages] = useState([]);

  const fetchImages = async () => {
    try {
      const res = await axios.get(`http://localhost:8080/api/photos/getphotos?email=${email}`);
      console.log("Responsee:", res.data);
      setImages(res.data);
    } catch (error) {
      console.error('Error fetching images:', error);
    }
  };

  useEffect(()=>{
    fetchImages();
  } , [isimage]);

  const handleImageChange = (event) => {
    setisimage(event.target.files[0]);
    console.log(isimage);
  };

  const handlesubmit = async()=>{
    const formData = new FormData();
    formData.append('image', isimage);
    formData.append('email', email);
    setisimage(false);

    try {
      await axios.post('http://localhost:8080/api/photos/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      });
      console.log('Image uploaded successfully');
      await fetchImages();
    } catch (error) {
      console.error('Error uploading image:', error);
    }


  }
  


  

  return (
    <>

        <div className="top">

          <h3>Welcome Back {fname} {lname}!!!</h3>

          <div className="addphoto"> 
          <h3>Add New Photo</h3>
          <input type="file" onChange={handleImageChange}/>
          {isimage?<button className="btn" onClick={handlesubmit}> Upload</button>:null}
          </div>
        </div>        

      <div className="photos">

      {images.map((image, index) => (
          <div key={image._id} className="photo">
            <img src={`http://localhost:8080/${image.filepath}`} alt={image.filename} />
          </div>
        ))}

      </div>
      <footer>© Sudhanshu </footer>

    </>
  );
}

export default Main;
