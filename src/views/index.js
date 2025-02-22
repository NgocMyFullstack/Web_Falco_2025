import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import ImageUpload from "./HoverImage/ImageUpload";

const Index = () => {
  const [selectedFiles, setSelectedFiles] = useState({
    image1: null,
    image2: null,
  });
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  const handleImageUpload = (inputNumber, file) => {
    const updatedFiles = { ...selectedFiles };
    updatedFiles[`image${inputNumber}`] = file;
    setSelectedFiles(updatedFiles);
  };

  const handlePromptChange = (event) => {
    setPrompt(event.target.value);
  };

  const onImageUpload = async () => {
    setLoading(true);
    setErrorMessage("");
    setResult(null);

    const formData = new FormData();
    formData.append("img_3d_input", selectedFiles.image1);
    formData.append("img_style_input", selectedFiles.image2);
    formData.append("promt_text", prompt.trim());

    try {
      const response = await fetch("/api/img-to-img/", {
        method: "POST",
        body: formData,
        mode: "cors",
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      if (data.image_data) {
        setResult(data.image_data);
      } else {
        setErrorMessage("No image data returned from the server.");
      }
    } catch (error) {
      setErrorMessage(
        "An error occurred while processing the images. Please try again."
      );
      console.error("Error fetching from server:", error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="container mt-5" style={{ paddingTop: "120px" }}>
      <div className="mb-5">
        <div className="upload-section mb-4 p-4 border rounded bg-light">
          <h3 className="text-secondary mb-3">3D View Image Input</h3>
          <div className="form-group">
            <ImageUpload
              inputNumber={1}
              onImageUpload={handleImageUpload}
              selectedFiles={selectedFiles}
            />
          </div>
        </div>

        <div className="upload-section mb-4 p-4 border rounded bg-light">
          <h3 className="text-secondary">Style Input</h3>
          <ImageUpload
            inputNumber={2}
            onImageUpload={handleImageUpload}
            selectedFiles={selectedFiles}
          />
        </div>

        <div className="prompt-section mb-4 p-4 border rounded bg-light">
          <h3 className="text-secondary">Prompt Text Input</h3>
          <input
            type="text"
            className="form-control"
            placeholder="Enter your prompt here..."
            value={prompt}
            onChange={handlePromptChange}
          />
        </div>

        <div className="upload-section mb-4 p-4 border rounded bg-light">
          <h3 className="text-secondary mb-3">Result image</h3>
          <div className="form-group">
            {loading && (
              <div
                id="mainLoading"
                className="loading text-center alert alert-info d-flex align-items-center justify-content-center"
              >
                <div
                  className="spinner-border text-primary me-3"
                  role="status"
                  aria-hidden="true"
                ></div>
                <span>Processing both images...</span>
              </div>
            )}

            {errorMessage && (
              <div
                id="mainError"
                className="error-message alert alert-danger text-center d-flex align-items-center justify-content-center"
              >
                <i className="bi bi-exclamation-circle-fill me-2"></i>
                <span>{errorMessage}</span>
              </div>
            )}

            {result && (
              <div
                id="resultSection"
                className="result-section mt-5 text-center"
              >
                <div className="image-grid d-flex justify-content-center mt-3">
                  <div className="image-container p-3 border rounded shadow-sm bg-light">
                    <div id="result" className="preview">
                      <a
                        href={`data:image/jpeg;base64,${result}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <img
                          style={{
                            width: "100%",
                            height: "90%",
                            objectFit: "cover",
                          }}
                          src={`data:image/jpeg;base64,${result}`}
                          alt="Generated Result"
                          className="img-fluid rounded shadow"
                        />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="text-center mb-4">
          <button
            type="submit"
            onClick={onImageUpload}
            id="submitButton"
            className="btn btn-primary btn-lg"
            disabled={!selectedFiles.image1 || !selectedFiles.image2} // Không kiểm tra prompt
          >
            Generate Image
          </button>
        </div>
      </div>
    </div>
  );
};

export default Index;
