import axios from "axios";

export const proxyRequest = async (req, res) => {
  const { url, method, body, headers } = req.body;

  if (!url || !method) {
    return res.status(400).json({ 
      success: false,
      error: "URL and method are required" 
    });
  }

  try {
    const start = Date.now();

    const axiosConfig = {
      method,
      url,
      headers: {
        "User-Agent":
          headers?.["User-Agent"] ||
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36",
        ...headers,
      },
      validateStatus: () => true,
      transformResponse: [(data) => data],
    };


    // Only add data for non-GET requests
    if (method !== "GET" && body) {
      axiosConfig.data = body;
    }

    const response = await axios(axiosConfig);
    const end = Date.now();

    // Try to parse response as JSON, fallback to raw text
    let parsedData;
    let contentType = "text";

    try {
      parsedData = JSON.parse(response.data);
      contentType = "json";
    } catch {
      parsedData = response.data;
      contentType = "text";
    }

    return res.status(200).json({
      success: true,
      status: response.status,
      statusText: response.statusText,
      time: `${end - start} ms`,
      contentType: contentType,
      headers: response.headers,
      data: parsedData,
    });

  } catch (error) {
    // Handle network errors and other exceptions
    return res.status(200).json({
      success: false,
      error: error.code || "NETWORK_ERROR",
      message: error.message,
      details: error.response?.data || null,
    });
  }
};