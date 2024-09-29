import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import ReactLoading from "react-loading";
import { ReactComponent as FileUpload } from "../../Assets/SVG/FileUpload.svg";
import api from "../../services/httpService";

export default function View() {
  const [fname, setfname] = useState(localStorage.getItem("username"));
  const [lname, setlname] = useState(localStorage.getItem("userlastname"));
  const [email, setemail] = useState(localStorage.getItem("useremail"));
  const [isimage, setisimage] = useState(null);
  const [err, seterr] = useState("");
  const inputFileRef = useRef(null);

  const [images, setImages] = useState([]);
  const [uploading, setuploading] = useState(false);
  const isInitialMount = useRef(true);

  const fetchImages2 = async () => {
    // `${process.env.REACT_APP_BACKEND_URL}/api/photos/getphotos`,
    try {
      seterr("");
      const res = await api.get(
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
        setuploading(false);
      } else {
        seterr("Not Image Found.");
      }
    } catch (error) {
      console.error("Error fetching images:", error);
      seterr(error);
    }
  };

  const fetchImages = async () => {
    // `${process.env.REACT_APP_BACKEND_URL}/api/photos/getphotos`,
    try {
      setImages([]);
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/api/files`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Error fetching images: ${response.statusText}`);
      }

      // Use the readable stream from the response to process the data
      // console.log("Responsee:", res.data);
      // console.log("Response:", res.data);
      // if (res.data && res.data.files) {
      //   setImages(res.data.files); // Set the files received from the backend
      // }
      const reader = response.body.getReader();
      const decoder = new TextDecoder("utf-8");
      let partialChunk = "";

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        // Decode the chunk and accumulate it
        const chunk = decoder.decode(value, { stream: true });
        partialChunk += chunk;

        // Split chunks by newlines to handle NDJSON format or custom delimiters
        const lines = partialChunk.split("\n");

        for (let i = 0; i < lines.length - 1; i++) {
          try {
            // Parse each complete line and add to images
            const parsedChunk = JSON.parse(lines[i]);
            console.log("Received File Data:", parsedChunk);

            // Update the state with each new file
            setImages((prevImages) => [...prevImages, parsedChunk]);
          } catch (err) {
            console.error("Error parsing chunk:", err);
          }
        }

        // Retain the last partial chunk that hasn't been completed yet
        partialChunk = lines[lines.length - 1];
      }

      console.log("Streaming complete");
      setuploading(false);
    } catch (error) {
      console.error("Error fetching images:", error);
    }
  };

  useEffect(() => {
    if (isInitialMount.current) {
      fetchImages(); // Call the fetchImages function only once
      isInitialMount.current = false; // Set to false after the first render
    }
  }, []);

  const handleImageChange = (event) => {
    setisimage(event.target.files[0]);
    console.log(isimage);
  };

  const handlesubmit = async () => {
    const formData = new FormData();

    // Create a file input element programmatically
    const inputFile = document.createElement("input");
    inputFile.type = "file";

    // Trigger the file selection dialog
    inputFile.click();

    // Wait for the user to select a file
    inputFile.onchange = async (event) => {
      const file = event.target.files[0]; // Get the selected file
      setuploading(true);

      if (file) {
        formData.append("file", file); // Append the file to formData
        formData.append("email", email); // Append the email to formData

        // Reset input value if needed (not necessary here as it's a programmatic input)
        inputFile.value = null;

        try {
          await api.post(
            `${process.env.REACT_APP_BACKEND_URL}/api/files`,
            formData
          );
          console.log("Image uploaded successfully");
          await fetchImages();
        } catch (error) {
          console.error("Error uploading image:", error);
        }
      }
    };
  };

  return (
    <div className="bg-white" style={{ marginTop: "60px" }}>
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
        <h2 className="sr-only" style={{ color: "black" }}>
          Images & Videos
        </h2>

        {(!images || images.length === 0) && !err && (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              width: "100%",
            }}
          >
            <ReactLoading
              type="spin"
              color="black"
              height={"20%"}
              width={"10%"}
            />
          </div>
        )}

        {err && <div>No Content Found.</div>}

        <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
          {images &&
            images.length > 0 &&
            images.map((file, index) => (
              <div key={index} className="group">
                {file.contentType.startsWith("image") && (
                  <>
                    <div className="aspect-h-1 aspect-w-1 overflow-hidden rounded-lg bg-gray-200 xl:aspect-h-8 xl:aspect-w-7">
                      <img
                        src={`data:${file.contentType};base64,${file.data}`}
                        alt={file.filename}
                        style={{
                          objectFit: "cover",
                          width: "100%",
                          height: "100%",
                        }}
                        className="h-full w-full object-cover object-center "
                      />
                    </div>
                    <h3 className="mt-4 text-sm text-gray-700">
                      {file.filename}
                    </h3>
                    {/* <p className="mt-1 text-lg font-medium text-gray-900">
                      {file.contentType}
                    </p> */}
                  </>
                )}
                {file.contentType.startsWith("video") && (
                  <>
                    <div className="aspect-h-1 aspect-w-1 overflow-hidden rounded-lg bg-gray-200 xl:aspect-h-8 xl:aspect-w-7">
                      <video
                        src={`data:${file.contentType};base64,${file.data}`}
                        style={{ objectFit: "cover" }}
                        controls
                        className="h-full w-full object-cover object-center"
                      />
                    </div>
                    <h3 className="mt-4 text-sm text-gray-700">
                      {file.filename}
                    </h3>
                    {/* <p className="mt-1 text-lg font-medium text-gray-900">
                      {file.contentType}
                    </p> */}
                  </>
                )}
              </div>
            ))}
        </div>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          position: "fixed",
          width: "60px",
          height: "60px",
          bottom: "50px",
          right: "50px",
          border: "3px solid black",
          borderRadius: "50%",
          cursor: "pointer",
        }}
        onClick={handlesubmit}
      >
        {uploading ? (
          <ReactLoading
            type="spin"
            color="black"
            height={"50%"}
            width={"50%"}
          />
        ) : (
          <FileUpload style={{ width: "40px", height: "40px", color: "red" }} />
        )}
      </div>
    </div>
  );
}
