import React, { useState, useEffect } from "react";
import "./generateuploadpro.css";

const MAX_FILENAME_LENGTH = 80; // Giới hạn số ký tự tên file

const GenerateUploadProPNG = ({
  inputNumber,
  onImageUpload,
  selectedFiles,
}) => {
  const [error, setError] = useState("");
  const file = selectedFiles[`image${inputNumber}`];
  let objectUrl = null;

  if (file) {
    objectUrl = URL.createObjectURL(file);
  }

  useEffect(() => {
    return () => {
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [file]);

  const fileInputId = `file-upload-${inputNumber}`;

  const handleFileChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      // Kiểm tra định dạng file
      if (file.type !== "image/png") {
        setError(" Chỉ upload file PNG.");
        e.target.value = ""; // Reset input
        return;
      }

      // Kiểm tra độ dài tên file
      if (file.name.length > MAX_FILENAME_LENGTH) {
        setError(` Image names cannot be too long.`);
        // ${MAX_FILENAME_LENGTH} ký tự
        e.target.value = "";
        return;
      }

      setError("");
      onImageUpload(inputNumber, file);
    }
  };

  return (
    <div className="file-upload-container">
      <button
        className="custom-file-wrapper"
        onClick={() => document.getElementById(fileInputId).click()}
      >
        <span className="custom-file-label">Choose File</span>
        <input
          id={fileInputId}
          type="file"
          accept="image/png"
          onChange={handleFileChange}
          className="hidden-input"
        />
      </button>

      <div className="column">
        <div className="preview">
          {file ? (
            <img
              src={objectUrl}
              alt={`Preview ${inputNumber}`}
              className="img-fluid rounded"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
          ) : (
            <span className="text-muted">
              {error ? (
                <span className="text-danger">{error}</span>
              ) : (
                <>
                  +
                  <br />
                  Drag & Drop an image or click <br /> here to upload
                  <br />
                  Ctrl + V
                </>
              )}
            </span>
          )}
        </div>
        <span className="text-danger">{error}</span>
      </div>
    </div>
  );
};

export default GenerateUploadProPNG;
