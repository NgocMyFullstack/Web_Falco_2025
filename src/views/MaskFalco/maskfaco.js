import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import "./maskfaco.css";
import GenerateUploadPro from "./generateuploadpro";
import "bootstrap/dist/css/bootstrap.min.css";
import { uploadImagesMask, startPollingMask } from "../../Services/Api";
import { Image, Space } from "antd";
import "react-medium-image-zoom/dist/styles.css";
import GenerateUploadProPNG from "./generateuploadpropng";
import showSessionExpiredAlert from "../../components/Dialog/alertService";

const MaskFalco = () => {
  const [projectName, setProjectName] = useState("");
  const [selectedFiles, setSelectedFiles] = useState({
    image1: null,
    image2: null,
  });
  const [prompt, setPrompt] = useState("0.4");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [pollingIntervalId, setPollingIntervalId] = useState(null);
  const [taskId, setTaskId] = useState(null);

  // button radio
  const location = useLocation();
  const [falcoOption, setFalcoOption] = useState(
    new URLSearchParams(location.search).get("falcoOption") || "config"
  );

  // upload img
  const handleImageUpload = (inputNumber, file) => {
    const updatedFiles = { ...selectedFiles };
    updatedFiles[`image${inputNumber}`] = file;
    setSelectedFiles(updatedFiles);
  };

  // input IPadater
  const handlePromptChange = (event) => {
    const value = event.target.value;
    setPrompt(value);
  };
  const handlePromptBlur = () => {
    if (prompt.trim() === "") {
      setPrompt("0.4");
    }
  };

  // zoom controls
  const [random, setRandom] = useState();

  // data API
  const onImageUpload = async () => {
    setLoading(true);
    setErrorMessage("");
    setResult(null);
    const defaultPrompt = "0.4";
    const formData = new FormData();
    formData.append("img_mask_input", selectedFiles.image1);
    formData.append("img_material_input", selectedFiles.image2);
    formData.append("ipadapter_weight", prompt.trim() || defaultPrompt);

    try {
      const data = await uploadImagesMask(formData);
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
        "Your session has expired. Please log in again.",
        console.error("Upload error: ", error.message || error)
      );
      setLoading(false);
    }
  };

  const startPollingForResult = (taskId) => {
    startPollingMask(
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
  const handleOptionChange = (option) => {
    setFalcoOption(option);
  };

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
            <div className="choose-3d-image-text">CHOOSE NAME </div>
            {/* <div className="form-table">
              <select className="form-control">
                <option>Đá</option>
                <option>Gỗ</option>
                <option>Gạch Ceramic</option>
                <option>gạch Porcelain</option>
                <option>Thảm trải</option>
              </select>
            </div> */}
            <GenerateUploadProPNG
              inputNumber={1}
              onImageUpload={handleImageUpload}
              selectedFiles={selectedFiles}
            />
          </div>
          <div className="row">
            <div className="choose-3d-image-text">CHOOSE MATERIAL</div>
            <GenerateUploadPro
              inputNumber={2}
              onImageUpload={handleImageUpload}
              selectedFiles={selectedFiles}
            />
          </div>

          <div className="prompt-container">
            <div className="prompt-text">IPADATER</div>
            <input
              type="text"
              className="input-placeholder"
              placeholder="0.4"
              value={prompt}
              onChange={handlePromptChange}
              onBlur={handlePromptBlur}
            />
          </div>

          {/* <div className="submit-button">
            <button
              type="submit"
              // onClick={onImageUpload}
              id="submitButton"
              className="generate-button"
            >
              DETECT MASK
            </button>
          </div> */}
          <div className="submit-button">
            <button
              type="submit"
              onClick={onImageUpload}
              id="submitButton"
              className="generate-button"
              disabled={
                !selectedFiles.image1 || !selectedFiles.image2 || loading
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
                <span className="text-muted">
                  RESULT <br /> IMAGE
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MaskFalco;
