import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import "./generatepro.css";
import { uploadImages, startPolling } from "../../Services/Api";
import GenerateUploadPro from "./generateuploadpro";
import "bootstrap/dist/css/bootstrap.min.css";

import { Image, Space } from "antd";

import "react-medium-image-zoom/dist/styles.css";
import showSessionExpiredAlert from "../../components/Dialog/alertService";

const GeneratePro = () => {
  const location = useLocation();
  const [selectedFiles, setSelectedFiles] = useState({
    image1: null,
    image2: null,
  });
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  // button radio
  const [falcoOption, setFalcoOption] = useState(
    new URLSearchParams(location.search).get("falcoOption") || "config"
  );
  const [taskId, setTaskId] = useState(null);

  const [pollingIntervalId, setPollingIntervalId] = useState(null);

  //Zoom controls
  const [random, setRandom] = useState();

  const handleOptionChange = (option) => {
    setFalcoOption(option);
  };

  // upload img
  const handleImageUpload = (inputNumber, file) => {
    const updatedFiles = { ...selectedFiles };
    updatedFiles[`image${inputNumber}`] = file;
    setSelectedFiles(updatedFiles);
  };

  const handlePromptChange = (event) => {
    setPrompt(event.target.value);
  };

  // data API
  const onImageUpload = async () => {
    setLoading(true);
    setErrorMessage("");
    setResult(null);
    const formData = new FormData();
    formData.append("img_3d_input", selectedFiles.image1);
    formData.append("img_style_input", selectedFiles.image2);
    formData.append("promt_text", prompt.trim());

    try {
      const data = await uploadImages(formData);
      if (data.task_id) {
        setTaskId(data.task_id);
        startPollingForResult(data.task_id);
      } else {
        setErrorMessage("No task ID returned from the server.");
        setLoading(false);
      }
    } catch (error) {
      showSessionExpiredAlert();
      setErrorMessage(
        "An error occurred while uploading the images. Please try again."
      );
      setLoading(false);
    }
  };

  const startPollingForResult = (taskId) => {
    startPolling(
      taskId,
      setResult,
      setErrorMessage,
      setLoading,
      setPollingIntervalId
    );
  };

  useEffect(() => {
    return () => {
      if (pollingIntervalId) {
        clearInterval(pollingIntervalId);
      }
    };
  }, [pollingIntervalId]);

  // download img
  const downloadImage = async (base64Data) => {
    const byteString = atob(base64Data);
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const uint8Array = new Uint8Array(arrayBuffer);

    for (let i = 0; i < byteString.length; i++) {
      uint8Array[i] = byteString.charCodeAt(i);
    }

    const blob = new Blob([uint8Array], { type: "image/png" });

    if (window.showSaveFilePicker) {
      try {
        // Mở hộp thoại lưu file
        const handle = await window.showSaveFilePicker({
          suggestedName: "generated-result.png",
          types: [
            {
              description: "PNG Image",
              accept: { "image/png": [".png"] },
            },
          ],
        });
        // Ghi dữ liệu vào file được chọn
        const writableStream = await handle.createWritable();
        await writableStream.write(blob);
        await writableStream.close();

        console.log("File saved successfully!");
      } catch (error) {
        console.error("User cancelled save or an error occurred:", error);
      }
    } else {
      // Nếu không hỗ trợ File System Access API, fallback tải về bằng cách tạo liên kết
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = "generated-result.png";
      link.click();
    }
  };
  return (
    <div className="container-fluid">
      <div className="rowpro">
        <div className=" col-md-7 col-lg-5 col-xxl-4">
          <div className="text-center">INPUT IMAGE</div>
          <div className="row">
            <div className="choose-3d-image-text">CHỌN 3D VIEW IMAGE</div>

            <GenerateUploadPro
              inputNumber={1}
              onImageUpload={handleImageUpload}
              selectedFiles={selectedFiles}
            />
          </div>
          <div className="row">
            <div className="choose-3d-image-text">CHỌN STYLE</div>
            <GenerateUploadPro
              inputNumber={2}
              onImageUpload={handleImageUpload}
              selectedFiles={selectedFiles}
            />
          </div>

          <div className="prompt-containers">
            <div className="prompt-text">PROMT TEXT</div>
            <input
              type="text"
              style={{ height: "200px" }}
              className="input-placeholder"
              placeholder="Enter your promt here..."
              value={prompt}
              onChange={handlePromptChange}
            />
          </div>

          <div className="submit-button">
            <button
              type="submit"
              onClick={onImageUpload}
              id="submitButton"
              className="generate-button"
              disabled={
                loading || !selectedFiles.image1 || !selectedFiles.image2
              }
            >
              Generate Image
            </button>
          </div>
          <div className="button-radio">
            <div className="d-flex justify-content-center align-items-center gap-3">
              <div className="form-check">
                <Link to={`/generatepro?falcoOption=config`}>
                  <input
                    className="form-check-input"
                    type="radio"
                    name="falcoOption"
                    id="configFalco"
                    value="config"
                    checked={falcoOption === "config"}
                    onChange={() => handleOptionChange("config")}
                  />
                  <label className="form-check-label" htmlFor="configFalco">
                    CONFIG FALCO
                  </label>
                </Link>
              </div>
              <div className="form-check">
                <Link to={`/generatepro/maskfalco?falcoOption=mask`}>
                  <input
                    className="form-check-input"
                    type="radio"
                    name="falcoOption"
                    id="maskFalco"
                    value="mask"
                    checked={falcoOption === "mask"}
                    onChange={() => handleOptionChange("mask")}
                  />
                  <label className="form-check-label" htmlFor="maskFalco">
                    MASK FALCO
                  </label>
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-5 col-lg-7 col-xxl-8 ">
          <div className="frame">
            {loading && (
              <div className="loading text-center alert alert-info d-flex align-items-center justify-content-center">
                <div
                  className="spinner-border text-primary me-3"
                  role="status"
                  aria-hidden="true"
                ></div>
                <span>Processing...</span>
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
              <div id="resultSection" className="result-section">
                <Space size={100}>
                  <Image
                    width={1550}
                    src={result ? `data:image/png;base64,${result}` : undefined}
                    placeholder={
                      <Image
                        preview={false}
                        src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png?x-oss-process=image/blur,r_50,s_50/quality,q_1/resize,m_mfit,h_200,w_200"
                        width={400}
                      />
                    }
                  />
                </Space>

                <div
                  className="savebutton"
                  style={{
                    position: "absolute",
                    bottom: "20px",
                    right: "200px",
                  }}
                >
                  <button
                    style={{
                      top: "",
                      width: "262px",
                      height: "50px",
                      flexShrink: 0,
                      marginLeft: "75%",
                      borderRadius: "20px",
                      background: "#5DB95F",
                    }}
                    onClick={() =>
                      downloadImage(result, "generated-result.png")
                    }
                    className="btn btn-primary"
                  >
                    SAVE IMAGE
                  </button>
                </div>
              </div>
            )}

            {!result && !loading && !errorMessage && (
              <div className="placeholder-text">
                <span className="text-muted">RESULT IMAGE</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GeneratePro;
