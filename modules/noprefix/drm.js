const fs = require("fs");
const axios = require("axios");
const path = require("path");

module.exports.config = {
  name: "drm",
  version: "1.0.1",
  hasPermssion: 0,
  credits: "HoangHao (API by KemAPIs)",
  description: "Gửi một video chill ngẫu nhiên",
  commandCategory: "Giải trí",
  usages: ".drm",
  cooldowns: 5
};

module.exports.run = async function({ api, event }) {
  const msgID = event.messageID;
  const threadID = event.threadID;

  try {
    // Gọi API video chill
    const res = await axios.get("https://api.hoanghao.lol/api/images/vddoraemon");
    const data = res.data;

    if (data.status !== "true") {
      return api.sendMessage("❌ Không thể lấy video chill lúc này!", threadID, msgID);
    }

    const url = data.url;
    const author = data.author || "Unknown";
    const description = data.description || "Video Chill";

    // Tạo thư mục nếu chưa có
    const folderPath = path.join(__dirname, "datavdchill");
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath);
    }

    // Tải và lưu video
    const fileName = `chill_${Date.now()}.mp4`;
    const filePath = path.join(folderPath, fileName);

    const videoStream = (await axios.get(url, { responseType: "stream" })).data;
    const writer = fs.createWriteStream(filePath);
    videoStream.pipe(writer);

    writer.on("finish", () => {
      api.sendMessage({
        body: `${description}\nvideo chill ${author}`,
        attachment: fs.createReadStream(filePath)
      }, threadID, () => {
        fs.unlinkSync(filePath); // Xóa sau khi gửi
      });
    });

    writer.on("error", () => {
      api.sendMessage("❌ Gặp lỗi khi tải video.", threadID, msgID);
    });

  } catch (err) {
    console.error(err);
    return api.sendMessage("⚠️ Có lỗi xảy ra khi xử lý yêu cầu.", threadID, msgID);
  }
};
