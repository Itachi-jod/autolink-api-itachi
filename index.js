const axios = require('axios');

module.exports = async (req, res) => {
  const url = req.query.url;
  const DEFAULT_AUTHOR = "ItachiXD";

  // Root path → API info
  if (req.url === '/' || req.url.startsWith('/?')) {
    res.setHeader('Content-Type', 'application/json');
    res.status(200).send(JSON.stringify({
      success: true,
      author: DEFAULT_AUTHOR,
      message: "Unified Video Downloader API",
      endpoints: {
        download: "/api/download?url={VIDEO_URL}"
      },
      platforms: ["YouTube", "Facebook", "TikTok", "Instagram", "Pinterest"],
      response_format: {
        success: "boolean",
        author: "string",
        platform: "string",
        download_url: "string"
      },
      usage_example: [
        "/api/download?url=https://youtube.com/watch?v=C8mJ8943X80",
        "/api/download?url=https://www.facebook.com/watch/?v=1393572814172251",
        "/api/download?url=https://www.tiktok.com/@user/video/123456789",
        "/api/download?url=https://www.instagram.com/p/ABCDEFG/",
        "/api/download?url=https://www.pinterest.com/pin/123456/"
      ]
    }, null, 2));
    return;
  }

  if (!url) {
    res.setHeader('Content-Type', 'application/json');
    res.status(400).send(JSON.stringify({ success: false, error: "Missing url parameter" }, null, 2));
    return;
  }

  try {
    let platform = '';
    let downloadUrl = '';

    // YouTube
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      platform = 'YouTube';
      const apiRes = await axios.get(`https://ita-social-dl.vercel.app/api/download?url=${encodeURIComponent(url)}`);
      if (apiRes.data.success) {
        downloadUrl = apiRes.data.data?.data?.data?.links?.[2]?.download_url 
                      || apiRes.data.data?.data?.data?.links?.[0]?.download_url;
      }
    } 
    // Pinterest
    else if (url.includes('pin.it') || url.includes('pinterest.com/pin/')) {
      platform = 'Pinterest';
      const apiRes = await axios.get(`https://pinterest-dl-itachi.vercel.app/api/download?url=${encodeURIComponent(url)}`);
      if (apiRes.data.success) {
        downloadUrl = apiRes.data.data?.medias?.[0]?.url;
      }
    } 
    // Facebook
    else if (url.includes("facebook.com") || url.includes("fb.watch")) {
  platform = "Facebook";

  const apiRes = await axios.get(
    `https://fb-video-dl-itachi.vercel.app/api/facebook?url=${encodeURIComponent(url)}`
  );

  if (apiRes.data.success) {
    const sd = apiRes.data.sd || null;
    const hd = apiRes.data.hd || null;

    // Prefer HD if available
    downloadUrl = hd || sd;
  }
}

    // TikTok
    else if (url.includes('tiktok.com')) {
      platform = 'TikTok';
      const apiRes = await axios.get(`https://tiktok-downloader-ita.vercel.app/api/download?url=${encodeURIComponent(url)}`);
      if (apiRes.data.success) {
        downloadUrl = apiRes.data.data?.medias?.[0]?.url;
      }
    } 
    // Instagram
    else if (url.includes('instagram.com')) {
      platform = 'Instagram';
      const apiRes = await axios.get(`https://insta-dl-itachi.vercel.app/api/download?url=${encodeURIComponent(url)}`);
      if (apiRes.data.success) {
        downloadUrl = apiRes.data.data?.data?.links?.[1]?.link;
      }
    } 
    else {
      res.setHeader('Content-Type', 'application/json');
      res.status(400).send(JSON.stringify({ success: false, error: "Unsupported platform" }, null, 2));
      return;
    }

    if (!downloadUrl) {
      res.setHeader('Content-Type', 'application/json');
      res.status(500).send(JSON.stringify({ success: false, error: "Download URL not found" }, null, 2));
      return;
    }

    // Success response
    res.setHeader('Content-Type', 'application/json');
    res.status(200).send(JSON.stringify({
      success: true,
      author: DEFAULT_AUTHOR,
      platform,
      download_url: downloadUrl
    }, null, 2));

  } catch (err) {
    res.setHeader('Content-Type', 'application/json');
    res.status(500).send(JSON.stringify({
      success: false,
      author: DEFAULT_AUTHOR,
      error: err.message
    }, null, 2));
  }
};
