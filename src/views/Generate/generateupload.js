import React, { useState, useEffect } from "react";
import "./generateupload.css";

const MAX_FILENAME_LENGTH = 80;

const GenerateUpload = ({ inputNumber, onImageUpload, selectedFiles }) => {
  const [errorMessage, setErrorMessage] = useState("");
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
      if (file.name.length > MAX_FILENAME_LENGTH) {
        setErrorMessage(
          `Image names cannot be too long `
          // (max ${MAX_FILENAME_LENGTH} chars)
        );
        return;
      }
      setErrorMessage(""); // Xóa lỗi nếu file hợp lệ
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
          accept="image/*"
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
              +
              <br />
              Drag & Drop an image or click <br /> here to upload
              <br />
              Ctrl + V
            </span>
          )}
        </div>
        {errorMessage && (
          <p
            className="error-message"
            style={{ color: "white", fontSize: "22px" }}
          >
            {errorMessage}
          </p>
        )}
      </div>
    </div>
  );
};

export default GenerateUpload;
