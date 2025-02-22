import React from "react";

const ImageUpload = ({ inputNumber, onImageUpload, selectedFiles }) => {
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    onImageUpload(inputNumber, file);
  };

  return (
    <div className="mb-3">
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="form-control"
      />

      <div
        className="preview mt-3 text-center"
        style={{
          width: "100%",
          height: "100%",
          margin: "0 auto",
          border: "1px dashed #ccc",
          borderRadius: "8px",
          backgroundColor: "#f9f9f9",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {selectedFiles[`image${inputNumber}`] ? (
          <img
            src={URL.createObjectURL(selectedFiles[`image${inputNumber}`])}
            alt={`Preview ${inputNumber}`}
            className="img-fluid rounded"
            style={{
              width: "100%",
              height: "90%",
              objectFit: "cover",
            }}
          />
        ) : (
          <span className="text-muted">No image uploaded</span>
        )}
      </div>
    </div>
  );
};

export default ImageUpload;
