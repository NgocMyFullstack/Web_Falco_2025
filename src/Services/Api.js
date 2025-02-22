import axios from "axios";

const apiUrl = "/api/";

const apiClient = axios.create({
  baseURL: apiUrl,
  headers: {
    "Content-Type": "multipart/form-data",
  },
});

// Interceptor để thêm Authorization header vào mỗi yêu cầu
apiClient.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (
      error.response &&
      (error.response.status === 401 || error.response.status === 403)
    ) {
      sessionStorage.clear();
      window.location.href = "/";
      // window.location.reload();
      return false;
    }
    return Promise.reject(error);
  }
);

// Hàm upload hình ảnh
export const uploadImages = async (formData) => {
  try {
    const response = await apiClient.post("img-to-img/", formData);
    console.log("Upload successful:", response.data);
    return response.data;
  } catch (error) {
    console.error("Upload error:", error.response || error.message);
    throw new Error(
      "An error occurred while uploading the images : " + error.message
    );
  }
};

// Hàm upload hình ảnh mask
export const uploadImagesMask = async (formData) => {
  try {
    const response = await apiClient.post("mask/", formData);
    console.log("Upload successful:", response.data);
    return response.data;
  } catch (error) {
    console.error("Upload error:", error.response || error.message);
    throw new Error(
      "An error occurred while uploading the images: " + error.message
    );
  }
};

// Hàm kiểm tra trạng thái hình ảnh
export const checkImageStatus = async (taskId) => {
  try {
    const response = await apiClient.get(`task-status/${taskId}/`);
    console.log("Status check successful:", response.data);
    return response.data;
  } catch (error) {
    console.error("Status check error:", error.response || error.message);
    throw new Error("Error checking image status: " + error.message);
  }
};

// Polling function Manager
export const startPolling = (
  taskId,
  setResult,
  setErrorMessage,
  setLoading,
  setPollingIntervalId
) => {
  const MAX_POLLING_TIME = 60 * 60 * 1000;
  const initialDelay = 60000;
  const subsequentDelay = 10000;
  let startTime = Date.now();
  let intervalId = null;

  const pollImageStatus = async () => {
    try {
      const data = await checkImageStatus(taskId);

      // Kiểm tra thời gian timeout (1 giờ)
      if (Date.now() - startTime > MAX_POLLING_TIME) {
        clearInterval(intervalId);
        setPollingIntervalId(null);
        setErrorMessage("Polling timed out. Please try again.");
        setLoading(false);
        return;
      }

      if (data.status === "PENDING") {
        console.log("Waiting for the process to start...");
        setLoading(true);
      } else if (data.status === "STARTED") {
        console.log("Process has started, beginning to track progress...");
        setLoading(true);
      } else if (data.status === "SUCCESS") {
        clearInterval(intervalId);
        setPollingIntervalId(null);
        setResult(data.result);
        setLoading(false);
      } else if (data.status === "FAILURE") {
        clearInterval(intervalId);
        setPollingIntervalId(null);
        setErrorMessage(data.error, "Processing failed. Please try again.");
        setLoading(false);
      }
    } catch (error) {
      clearInterval(intervalId);
      setPollingIntervalId(null);
      // Kiểm tra nếu error.response tồn tại (Axios error)
      const errorMessage =
        error.response?.data?.error ||
        error.response?.data?.message ||
        error.message ||
        "An error occurred while polling the image status. Please try again.";

      setErrorMessage(errorMessage);
      setLoading(false);
    }
  };

  // polling = 60s
  setTimeout(() => {
    pollImageStatus();

    // polling = 10s
    intervalId = setInterval(() => {
      pollImageStatus();
    }, subsequentDelay);

    setPollingIntervalId(intervalId);
  }, initialDelay);
};

// Polling function Mask
export const startPollingMask = (
  taskId,
  setResult,
  setErrorMessage,
  setLoading,
  setPollingIntervalId
) => {
  const MAX_POLLING_TIME = 60 * 60 * 1000;
  const initialDelay = 40000;
  const subsequentDelay = 10000;
  let startTime = Date.now();
  let intervalId = null;

  const pollImageStatus = async () => {
    try {
      const data = await checkImageStatus(taskId);

      // Kiểm tra thời gian timeout (1 giờ)
      if (Date.now() - startTime > MAX_POLLING_TIME) {
        clearInterval(intervalId);
        setPollingIntervalId(null);
        setErrorMessage("Polling timed out. Please try again.");
        setLoading(false);
        return;
      }

      if (data.status === "PENDING") {
        console.log("Waiting for the process to start...");
        setLoading(true);
      } else if (data.status === "STARTED") {
        console.log("Process has started, beginning to track progress...");
        setLoading(true);
      } else if (data.status === "SUCCESS") {
        clearInterval(intervalId);
        setPollingIntervalId(null);
        setResult(data.result);
        setLoading(false);
      } else if (data.status === "FAILURE") {
        clearInterval(intervalId);
        setPollingIntervalId(null);
        setErrorMessage(data.error, "Processing failed. Please try again.");
        setLoading(false);
      }
    } catch (error) {
      clearInterval(intervalId);
      setPollingIntervalId(null);
      // Kiểm tra nếu error.response tồn tại (Axios error)
      const errorMessage =
        error.response?.data?.error ||
        error.response?.data?.message ||
        error.message ||
        "An error occurred while polling the image status. Please try again.";

      setErrorMessage(errorMessage);
      setLoading(false);
    }
  };

  // polling = 60s
  setTimeout(() => {
    pollImageStatus();

    // polling = 10s
    intervalId = setInterval(() => {
      pollImageStatus();
    }, subsequentDelay);

    setPollingIntervalId(intervalId);
  }, initialDelay);
};

export default apiClient;
