const axios = require('axios');

module.exports = async (req, res) => {
  const url = req.query.url;

  // Root path → API info
  if (req.url === '/' || req.url.startsWith('/?')) {
    res.status(200).json({
      success: true,
      author: "ItachiXD",
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
    });
    return;
  }

  // /api/download endpoint
  if (!url) {
    res.status(400).json({ success: false, error: "Missing url parameter" });
    return;
  }

  const DEFAULT_AUTHOR = "ItachiXD";

  try {
    let platform = '';
    let downloadUrl = '';

    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      platform = 'YouTube';
      const apiRes = await axios.get(`https://ita-social-dl.vercel.app/api/download?url=${encodeURIComponent(url)}`);

      if (apiRes.data.success) {
        // 426p first, fallback to 640p
        downloadUrl = apiRes.data.data.data.links[2]?.download_url || apiRes.data.data.data.links[0]?.download_url;
      }
    } 
    else if (url.includes('pin.it') || url.includes('pinterest.com/pin/')) {
      platform = 'Pinterest';
      const apiRes = await axios.get(`https://fbdl-minato.vercel.app/api/fbdl?url=${encodeURIComponent(url)}`);
      
      if (apiRes.data.success) {
        downloadUrl = apiRes.data.data.medias?.url || apiRes.data.data.data?.medias?.url;
      }
    } 
    else if (url.includes('facebook.com') || url.includes('fb.watch')) {
      platform = 'Facebook';
      const apiRes = await axios.get(`https://itachi-fb-video-dl.vercel.app/api/facebook?url=${encodeURIComponent(url)}`);

      if (apiRes.data.success) {
        downloadUrl = apiRes.data.hd || apiRes.data.sd;
      }
    }
    else if (url.includes('tiktok.com')) {
      platform = 'TikTok';
      const apiRes = await axios.get(`https://tiktok-downloader-ita.vercel.app/api/download?url=${encodeURIComponent(url)}`);

      if (apiRes.data.success) {
        downloadUrl = apiRes.data.data.medias[0]?.url;
      }
    } 
    else if (url.includes('instagram.com')) {
      platform = 'Instagram';
      const apiRes = await axios.get(`https://instagram-dl-iota.vercel.app/Instagram?url=${encodeURIComponent(url)}`);

      if (apiRes.data.success) {
        downloadUrl = apiRes.data.data.videoUrl || apiRes.data.data.data?.videoUrl;
      }
    } 
    else {
      res.status(400).json({ success: false, error: "Unsupported platform" });
      return;
    }

    if (!downloadUrl) {
      res.status(500).json({ success: false, error: "Download URL not found" });
      return;
    }

    res.status(200).json(JSON.parse(JSON.stringify({
      success: true,
      author: DEFAULT_AUTHOR,
      platform,
      download_url: downloadUrl
    }, null, 2)));

  } catch (err) {
    res.status(500).json(JSON.parse(JSON.stringify({
      success: false,
      author: DEFAULT_AUTHOR,
      error: err.message
    }, null, 2)));
  }
};
