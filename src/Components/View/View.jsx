import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import ReactLoading from "react-loading";
import { ReactComponent as FileUpload } from "../../Assets/SVG/FileUpload.svg";
import api from "../../services/httpService";
import { saveAs } from "file-saver";
import css from "./Views.module.css";

export default function View(props) {
  const [email, setemail] = useState(localStorage.getItem("useremail"));
  const [isimage, setisimage] = useState([]);
  const [err, seterr] = useState(null);
  const [loading, setloading] = useState(true);
  const [deleteId, setdeleteId] = useState(0);
  const [shareId, setshareId] = useState(0);

  useEffect(() => {
    setemail(localStorage.getItem("useremail"));
  }, []);

  const [images, setImages] = useState([]);
  const [uploading, setuploading] = useState(false);
  const isInitialMount = useRef(true);

  const fetchImages = async (uploaded) => {
    try {
      setloading(true);
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
      const reader = response.body.getReader();
      const decoder = new TextDecoder("utf-8");
      let partialChunk = "";

      if (!uploaded) {
        setImages([]);
      }

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        partialChunk += chunk;

        const lines = partialChunk.split("\n");

        for (let i = 0; i < lines.length - 1; i++) {
          try {
            const parsedChunk = JSON.parse(lines[i]);

            if (uploaded) {
              if (!images.some((item) => item._id === parsedChunk._id)) {
                setImages((prevImages) => [parsedChunk, ...prevImages]);
                props.showalert("Image uploaded successfully", "success");
              }
              setuploading(false);
              return;
            } else {
              setImages((prevImages) => [...prevImages, parsedChunk]);
            }
          } catch (err) {
            console.error("Error parsing chunk:", err);
          }
        }

        partialChunk = lines[lines.length - 1];
      }
      setloading(false);
    } catch (error) {
      console.error("Error fetching images:", error);
      setuploading(false);
    }
  };

  const handleDelete = async (file) => {
    try {
      const id = file._id;
      setloading(true);
      setdeleteId(file._id);

      const { data } = await api.post("/api/files/delete", { id: id });
      if (data?.success) {
        // await fetchImages();
        const image = images.filter((item) => item._id !== file._id);
        setImages(image);
        setdeleteId(0);
      }
      props.showalert("Deleted successfully", "success");
    } catch (err) {
      console.error("Error in delete file", err);
      setloading(false);
      setdeleteId(0);
    }
  };

  useEffect(() => {
    if (isInitialMount.current) {
      fetchImages(false);
      isInitialMount.current = false;
    }
  }, []);

  const handlesubmit = async () => {
    try {
      const formData = new FormData();

      const inputFile = document.createElement("input");
      inputFile.type = "file";

      inputFile.click();

      inputFile.onchange = async (event) => {
        const file = event.target.files[0];
        setuploading(true);

        if (file) {
          formData.append("file", file);
          formData.append("email", email);

          inputFile.value = null;

          try {
            await api.post(
              `${process.env.REACT_APP_BACKEND_URL}/api/files`,
              formData,
              {
                headers: {
                  "Content-Type": "multipart/form-data",
                  authorization: `Bearer ${localStorage.getItem("token")}`,
                },
              }
            );
            await fetchImages(true);
          } catch (error) {
            console.error("Error uploading image:", error);
            setuploading(false);
          }
        }
      };
    } catch (err) {
      console.error("Error in uploading image/video.", err);
      setuploading(false);
    }
  };

  const handleShare = (file) => {
    try {
      setshareId(file?._id);
      navigator.clipboard.writeText(
        `data:${file.contentType};base64,${file.data}`
      );
      props.showalert("Share link copied to clipboard", "success");
      setshareId(0);
    } catch (err) {
      setshareId(0);
      props.showalert("Failed to copy", "danger");
      console.error("Error in sharing : ", err);
    }
  };

  return (
    <div className="bg-white" style={{ marginTop: "60px" }}>
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
        <h2 className="sr-only" style={{ color: "black" }}>
          Images & Videos
        </h2>

        {(!images || images.length === 0) && loading && !err && (
          // <div
          //   style={{
          //     display: "flex",
          //     justifyContent: "center",
          //     alignItems: "center",
          //     width: "100%",
          //   }}
          // >
          //   <ReactLoading
          //     type="spin"
          //     color="black"
          //     height={"20%"}
          //     width={"10%"}
          //   />
          // </div>

          <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
            <div className={css.skeleton}></div>
            <div className={css.skeleton}></div>
            <div className={css.skeleton}></div>
            <div className={css.skeleton}></div>
            <div className={css.skeleton}></div>
            <div className={css.skeleton}></div>
            <div className={css.skeleton}></div>
            <div className={css.skeleton}></div>
          </div>
        )}

        {!loading && images.length <= 0 && (
          <div
            style={{
              height: "20%",
              fontSize: "30px",
              fontWeight: "700",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            No image and Video found.
          </div>
        )}

        <div
          className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8"
          style={{ paddingBottom: "100px" }}
        >
          {images &&
            images.length > 0 &&
            images.map((file, index) => (
              <div key={index} className="group">
                {file.contentType.startsWith("image") ? (
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
                  </>
                ) : (
                  <div className="aspect-h-1 aspect-w-1 overflow-hidden rounded-lg bg-gray-200 xl:aspect-h-8 xl:aspect-w-7">
                    <video
                      src={`data:${file.contentType};base64,${file.data}`}
                      style={{ objectFit: "cover" }}
                      controls
                      className="h-full w-full object-cover object-center"
                    />
                  </div>
                )}

                <div>
                  <h3 className="mt-4 text-sm px-2 text-gray-700">
                    {file.filename.slice(
                      0,
                      file.filename.length > 15 ? 15 : file.filename.length
                    )}
                    {file.filename.length > 15
                      ? `...${file.filename.slice(
                          file.filename.lastIndexOf(".") - 1,
                          file.filename.length
                        )}`
                      : ""}
                  </h3>
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-evenly",
                    alignItems: "center",
                    height: "50px",
                    border: "0px solid black",
                  }}
                >
                  <button
                    onClick={async () => {
                      const response = await axios.get(
                        `data:${file.contentType};base64,${file.data}`,
                        {
                          responseType: "blob",
                        }
                      );
                      const blobUrl = window.URL.createObjectURL(
                        new Blob([response.data])
                      );

                      saveAs(blobUrl, file.filename);
                    }}
                    className="mt-4 text-sm text-white p-2 rounded-lg bg-black"
                  >
                    Download
                  </button>
                  <button
                    onClick={() => handleDelete(file)}
                    className="mt-4 text-sm text-white p-2 rounded-lg bg-black"
                  >
                    {deleteId !== file._id ? "Delete" : "Deleting..."}
                  </button>

                  <button
                    onClick={() => handleShare(file)}
                    className="mt-4 text-sm text-white p-2 rounded-lg bg-black"
                  >
                    {shareId !== file._id ? "Share" : "Sharing..."}
                  </button>
                </div>
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
          border: "2px solid black",
          borderRadius: "15px",
          cursor: "pointer",
          backgroundColor: "transparent",
          backfaceVisibility: "none",
          padding: "5px",
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
          <>
            <FileUpload
              style={{ width: "40px", height: "40px", color: "red" }}
            />
          </>
        )}
      </div>
    </div>
  );
}
