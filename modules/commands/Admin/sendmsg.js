module.exports.config = {
	name: "sendmsg",
	version: "1.0.7",
	hasPermssion: 0,
	credits: "", 
	description: "Gửi tin hắn đến người dùng(user)/nhóm(thread) bằng ID!",
	commandCategory: "Admin",
	usages: "ID [Text]",
	cooldowns: 5
};

	module.exports.run = async ({ api, event, args, getText, utils, Users }) => {
    const moment = require("moment-timezone");
      var gio = moment.tz("Asia/Ho_Chi_Minh").format("HH:mm:s || DD/MM/YYYY");
		var idbox = args[0];
		var reason = args.slice(1);
    let name = await Users.getNameUser(event.senderID)
		if (args.length == 0) api.sendMessage("Syntax error, use: sendmsg ID_BOX [lời nhắn]", event.threadID, event.messageID);
	else 
	    if(reason == "")api.sendMessage("Syntax error, use: sendmsg ID_BOX [lời nhắn]", event.threadID, event.messageID);
		if (event.type == "message_reply") {
			const request = global.nodemodule["request"];
			const fs = require('fs')
			const axios = require('axios')  
			var getURL = await request.get(event.messageReply.attachments[0].url);
			
					var pathname = getURL.uri.pathname;
			
					var ext = pathname.substring(pathname.lastIndexOf(".") + 1);
			
					var path = __dirname + `/cache/snoti`+`.${ext}`;
			
			
			var abc = event.messageReply.attachments[0].url;
				let getdata = (await axios.get(`${abc}`, { responseType: 'arraybuffer' })).data;
			
			  fs.writeFileSync(path, Buffer.from(getdata, 'utf-8'));	
	await api.sendMessage({body: `「 THÔNG BÁO TỪ ADMIN ĐẾN NHÓM 」\n➝ Vào lúc: ${gio}\n➝ 𝙰𝙳𝙼𝙸𝙽: ${name} With Love\n---------------[📝] ➜ Nội dung ---------------\n` + reason.join(" "), attachment: fs.createReadStream(path) }, idbox, () =>
			api.sendMessage(`${api.getCurrentUserID()}`, () =>
				api.sendMessage("Đã gửi lời nhắn: " + reason.join(" "), event.threadID)));
} 
else {
		await api.sendMessage(`「 THÔNG BÁO TỪ ADMIN ĐẾN NHÓM 」\n➝ Vào lúc: ${gio}\n➝ 𝙰𝙳𝙼𝙸𝙽: ${name}\n---------------[📝] ➜ Nội dung ---------------\n` + reason.join(" "), idbox, () =>
			api.sendMessage(`${api.getCurrentUserID()}`, () =>
				api.sendMessage("Đã gửi lời nhắn: " + reason.join(" "), event.threadID)));

	}
}