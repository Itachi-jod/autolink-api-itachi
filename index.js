const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// Pretty Printer
function pretty(obj) {
  return JSON.stringify(obj, null, 2);
}

// Detect platform
function detectPlatform(url) {
  if (url.includes("tiktok.com")) return "TikTok";
  if (url.includes("instagram.com")) return "Instagram";
  if (url.includes("facebook.com") || url.includes("fb.watch")) return "Facebook";
  return "Unknown";
}

app.get("/api/download", async (req, res) => {
  const videoUrl = req.query.url;

  if (!videoUrl) {
    return res.status(400).send(
      pretty({
        success: false,
        author: "ItachiXD",
        message: "Missing ?url="
      })
    );
  }

  try {
    const headers = {
      "Content-Type": "application/json",
      Accept: "application/json, text/plain, */*",
      "User-Agent":
        "Mozilla/5.0 (Linux; Android 10) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Mobile Safari/537.36",
      Origin: "https://downloady.vercel.app",
      Referer: "https://downloady.vercel.app/",
    };

    // ⬇ Call the real backend
    const apiRes = await axios.post(
      "https://downloady.vercel.app/api/initiate-download",
      { url: videoUrl },
      { headers }
    );

    // ⬇ Extract single video URL
    const data = apiRes.data;

    let finalUrl =
      data?.videoUrl ||
      data?.download_url ||
      data?.url ||
      data?.links?.download ||
      data?.links?.[0] ||
      null;

    if (!finalUrl) {
      return res.status(500).send(
        pretty({
          success: false,
          author: "ItachiXD",
          message: "Could not extract video URL",
          raw: data
        })
      );
    }

    return res.send(
      pretty({
        success: true,
        author: "ItachiXD",
        platform: detectPlatform(videoUrl),
        download_url: finalUrl
      })
    );
  } catch (err) {
    return res.status(500).send(
      pretty({
        success: false,
        author: "ItachiXD",
        error: err.response?.data || err.message
      })
    );
  }
});

// Root endpoint
app.get("/", (req, res) => {
  res.send(
    pretty({
      author: "ItachiXD",
      status: "Downloader API Running"
    })
  );
});

module.exports = app;
