import FormData from "form-data";
import Jimp from "jimp";

async function processing(urlPath, method) {
	return new Promise(async (resolve, reject) => {
		let Methods = ["enhance", "recolor", "dehaze"];
		Methods.includes(method) ? (method = method) : (method = Methods[0]);
		let buffer,
			Form = new FormData(),
			scheme = "https" + "://" + "inferenceengine" + ".vyro" + ".ai/" + method;
		Form.append("model_version", 1, {
			"Content-Transfer-Encoding": "binary",
			contentType: "multipart/form-data; charset=utf-8",
		});
		Form.append("image", Buffer.from(urlPath), {
			filename: "enhance_image_body.jpg",
			contentType: "image/jpeg",
		});
		Form.submit(
			{
				url: scheme,
				host: "inferenceengine" + ".vyro" + ".ai",
				path: "/" + method,
				protocol: "https:",
				headers: {
					"User-Agent": "okhttp/4.9.3",
					Connection: "Keep-Alive",
					"Accept-Encoding": "gzip",
				},
			},
			function (err, res) {
				if (err) reject();
				let data = [];
				res
					.on("data", function (chunk, resp) {
						data.push(chunk);
					})
					.on("end", () => {
						resolve(Buffer.concat(data));
					});
				res.on("error", (e) => {
					reject();
				});
			}
		);
	});
}

let handler = async (m, { conn, usedPrefix, command }) => {
	// Sending the initial reaction for loading
	await conn.relayMessage(m.chat, {
		reactionMessage: { 
			key: m.key, 
			text: '⏱️' 
		}
	}, { messageId: m.key.id });
  
	switch (command) {
		case "remini":
		case "color":
		case "hdr": {
			conn[command] = conn[command] || {};
			if (m.sender in conn[command]) 
				throw "Masih Ada Proses Yang Belum Selesai Kak, Silahkan Tunggu Sampai Selesai Yah >//<";
			
			let q = m.quoted ? m.quoted : m;
			let mime = (q.msg || q).mimetype || q.mediaType || "";
			if (!mime) throw `Fotonya Mana Kak?`;
			if (!/image\/(jpe?g|png)/.test(mime)) throw `Mime ${mime} tidak support`;

			conn[command][m.sender] = true;
			m.reply("Proses Kak...");
			let img = await q.download?.();
			let error;

			try {
				const This = await processing(img, command === "hdr" ? "dehaze" : "enhance");
				conn.sendFile(m.chat, This, "", "Sudah Jadi Kak >//<", m);
			} catch (er) {
				error = true;
			} finally {
				if (error) m.reply("Proses Gagal :(");
				delete conn[command][m.sender];
				// Sending a final reaction for completion
				await conn.relayMessage(m.chat, {
					reactionMessage: {
						key: m.key,
						text: error ? '❌' : '✅'
					}
				}, { messageId: m.key.id });
			}
			break;
		}
	}
};

handler.help = ["remini"];
handler.tags = ["main"];
handler.premium = false;
handler.group = false;
handler.limit = true;
handler.command = ["remini", "color", "hdr"];

export default handler;
/*
SCRIPT BY © VYNAA VALERIE 
•• recode kasih credits 
•• contacts: (t.me/VLShop2)
•• instagram: @vynaa_valerie 
•• (github.com/VynaaValerie) 
*/