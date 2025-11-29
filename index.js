import express from "express";
import axios from "axios";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

// Always pretty-print JSON responses
app.set("json spaces", 2);

// API LIST (Pinterest added)
const APIS = {
  tiktok: "https://tiktok-downloader-ita.vercel.app/api/download?url=",
  instagram: "https://instagram-dl-iota.vercel.app/Instagram?url=",
  facebook: "https://itachi-fb-video-dl.vercel.app/api/facebook?url=",
  youtube: "https://ita-social-dl.vercel.app/api/download?url=",
  pinterest: "https://pinterest-dl-itachi.vercel.app/api/download?url="
};

// Detect platform
function detectPlatform(url) {
  if (/tiktok\.com/.test(url)) return "tiktok";
  if (/instagram\.com|ig\.me/.test(url)) return "instagram";
  if (/facebook\.com|fb\.watch/.test(url)) return "facebook";
  if (/youtube\.com|youtu\.be/.test(url)) return "youtube";
  if (/pinterest\.com|pin\.it/.test(url)) return "pinterest"; // NEW
  return null;
}

// ROOT ENDPOINT
app.get("/", (req, res) => {
  res.send("AutoLink API by Itachi is running!");
});

// AUTO DOWNLOADER ENDPOINT
app.get("/download", async (req, res) => {
  const url = req.query.url;

  if (!url) {
    return res.status(400).json({
      success: false,
      message: "Missing ?url="
    });
  }

  const platform = detectPlatform(url);
  if (!platform) {
    return res.status(400).json({
      success: false,
      message: "Unsupported URL!"
    });
  }

  try {
    const apiUrl = APIS[platform] + encodeURIComponent(url);
    const response = await axios.get(apiUrl);

    return res.json({
      success: true,
      platform,
      author: "ItachiXD",
      data: response.data
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Downloader API error",
      error: error.message
    });
  }
});

const PORT = 3000;
app.listen(PORT, () =>
  console.log("AutoLink API running on port " + PORT)
);

export default app;
