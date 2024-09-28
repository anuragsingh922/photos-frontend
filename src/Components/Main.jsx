import React, { useEffect, useRef, useState } from "react";
import "./Main.css";
import axios from "axios";
import { useNavigate } from 'react-router-dom';

function Main() {
  const [fname, setfname] = useState(localStorage.getItem("username"));
  const [lname, setlname] = useState(localStorage.getItem("userlastname"));
  const [email, setemail] = useState(localStorage.getItem("useremail"));
  const [isimage, setisimage] = useState(null);
  const inputFileRef = useRef(null);

  const [images, setImages] = useState([]);

  const fetchImages = async () => {
    // `${process.env.REACT_APP_BACKEND_URL}/api/photos/getphotos`,
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/api/files`,
        {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
            authorization: localStorage.getItem("token"),
          },
        }
      );
      console.log("Responsee:", res.data);
      console.log("Response:", res.data);
      if (res.data && res.data.files) {
        setImages(res.data.files); // Set the files received from the backend
      }
    } catch (error) {
      console.error("Error fetching images:", error);
    }
  };

  const fetchImages2 = async () => {
    // `${process.env.REACT_APP_BACKEND_URL}/api/photos/getphotos`,
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/api/files`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            authorization: localStorage.getItem("token"),
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Error fetching images: ${response.statusText}`);
      }

      // Use the readable stream from the response to process the data
      const reader = response.body.getReader();
      // console.log("Responsee:", res.data);
      // console.log("Response:", res.data);
      // if (res.data && res.data.files) {
      //   setImages(res.data.files); // Set the files received from the backend
      // }
      const decoder = new TextDecoder("utf-8");

      let done = false;
      let receivedFiles = [];

      while (true) {
        const { value, done } = await reader.read();

        if (done) {
          break;
        }

        // Decode chunk and parse the JSON
        const chunk = decoder.decode(value);
        console.log("Chunk : ", chunk);
        if (chunk) {
          const parsedChunk = JSON.parse(chunk);
          console.log(parsedChunk);

          // Assuming each chunk is an individual file object
          if (parsedChunk) {
            setImages((prv) => [...prv, parsedChunk]);
          }
        }
      }
    } catch (error) {
      console.error("Error fetching images:", error);
    }
  };

  useEffect(() => {
    fetchImages();
  }, []);

  const handleImageChange = (event) => {
    setisimage(event.target.files[0]);
    console.log(isimage);
  };

  const handlesubmit = async () => {
    const formData = new FormData();
    formData.append("file", isimage);
    formData.append("email", email);
    setisimage(false);
    if (inputFileRef.current) {
      inputFileRef.current.value = null; // Reset input value
    }

    try {
      await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/files`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            authorization: localStorage.getItem("token"),
          },
        }
      );
      console.log("Image uploaded successfully");
      await fetchImages();
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };

  return (
    <>
      <div className="top">
        <h3>
          Welcome Back {fname} {lname}!!!
        </h3>

        <div className="addphoto">
          <h3>Add New Photo</h3>
          <input type="file" ref={inputFileRef} onChange={handleImageChange} />
          {isimage ? (
            <button className="btn" onClick={handlesubmit}>
              Upload
            </button>
          ) : null}
        </div>
      </div>

      {/* {images && images.length > 0 ? (
        <div className="photos">
          {images.map((image, index) => (
            <div key={image._id} className="photo">
              <img
                src={`${process.env.REACT_APP_BACKEND_URL}/${image.filepath}`}
                alt={image.filename}
              />
            </div>
          ))} */}

      {images && images.length > 0 ? (
        <div className="photos">
          {images.map((file, index) => (
            <div key={index} className="photo">
              {/* Render images */}
              {file.contentType.startsWith("image") && (
                <img
                  src={`data:${file.contentType};base64,${file.data}`}
                  alt={file.filename}
                  className="file-image"
                />
              )}

              {/* Render videos */}
              {file.contentType.startsWith("video") && (
                <video
                  src={`data:${file.contentType};base64,${file.data}`}
                  controls
                  className="file-video"
                />
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="skeleton h-32 w-32"></div>
      )}
      <footer className="footer">© Anurag </footer>
    </>
  );
}

export default Main;
