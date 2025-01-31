const {
	Browsers,
	proto,
	DisconnectReason,
	useMultiFileAuthState,
	fetchLatestBaileysVersion,
	makeCacheableSignalKeyStore,
	getAggregateVotesInPollMessage,
	makeInMemoryStore,
    generateWAMessage,
    jidNormalizedUser,
    areJidsSameUser
} = (await import('@adiwajshing/baileys')).default

import readline from "readline"
import pino from "pino";
import chalk from "chalk";
import { join, resolve } from "path";
import { existsSync, promises } from "fs";
import NodeCache from "node-cache"
const msgRetryCounterCache = new NodeCache()
import { makeWASocket } from "./simple.js";
export let conn = null;
export const conns = new Map();
export const authFolder = "sessions/";
export const authState = await useMultiFileAuthState(join(authFolder, "parent"));

export const logger = pino({ level: "fatal" });
global.store = makeInMemoryStore({ logger: pino().child({ level: 'silent', stream: 'store' }) });
const sleep = async(ms) => { return new Promise(resolve => setTimeout(resolve, ms)) }
const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

export async function start(conn = null, opts = { authState, isChild }) {
    const question = (text) => new Promise((resolve) => rl.question(text, resolve));
	const { version, isLatest } = await fetchLatestBaileysVersion();
	console.log(`using WA v${version.join('.')}, isLatest: ${isLatest}`);
  	const args = process.argv;
  	let phoneNumber = args[args.length-1]
    if(args.some(a => a.includes("pairing")) && phoneNumber) {
        global.pairingCode = true
    } 
    
    console.log(phoneNumber)
    

	/** @type {import('@adiwajshing/baileys').UserFacingSocketConfig} */
	const connectionOptions = {
		logger,
		browser:  Browsers.ubuntu('Chrome'),
		version: [ 2, 3000, 1015901307 ],
		auth: {
			creds: opts.authState?.state.creds,
			keys: makeCacheableSignalKeyStore(opts.authState?.state.keys, logger.child({ stream: "store" }))
		},
		getMessage: async (key) => {
            let jid = jidNormalizedUser(key.remoteJid)
            let msg = await store.loadMessage(jid, key.id)
            return msg?.message || ""
        },
		msgRetryCounterCache,
		//syncFullHistory: false, // biar gak lemot saat start bot
	};
	
	/** @type {Socket} sock */
	const sock = makeWASocket(connectionOptions, { ...(conn && conn.chats ? { chats: conn.chats } : {}) });
	
	if (global.pairingCode && !sock.authState.creds.registered) {
	        await sleep(3000)
            let code = await sock.requestPairingCode(phoneNumber);
            console.log(chalk.bold.rgb(255, 136, 0)(`\n [ ${chalk.yellow('Your Pairing Code:')} ${chalk.greenBright(code)} ] \n`)
            );
          }
	if (conn) {
		sock.isInit = conn.isInit;
		sock.isReloadInit = conn.isReloadInit;
	};
	
	if (sock.isInit == null) {
		sock.isInit = false;
		sock.isReloadInit = true;
	};
	
	
        
	
	// @ts-ignore
	await reload(sock, false, opts).catch(console.error);
	return sock;
};

let oldHandler = null;
export async function reload(conn = {}, restartConnection, opts = { authState, isChild }) {
	if (!opts.handler) opts.handler = await importFile("./handler.js");
	if (opts.handler instanceof Promise) opts.handler = await opts.handler;
	if (!opts.handler && oldHandler) opts.handler = oldHandler;
	oldHandler = opts.handler;
	
	const isReloadInit = !!conn.isReloadInit;

	if (restartConnection) {
		console.log("restarting connection...");
		// eslint-disable-next-line no-empty
		try { conn.ws.close() } catch { };
		// @ts-ignore
		conn.ev.removeAllListeners();
		Object.assign(conn, await start(conn, opts) || {});
	};
	
	Object.assign(conn, messageConfig());
	
        
	if (!isReloadInit) {
        if(conn.pollUpdate) conn.ev.off('messages.update', conn.pollUpdate);
		if (conn.credsUpdate) conn.ev.off("creds.update", conn.credsUpdate);
		if (conn.handler) conn.ev.off("messages.upsert", conn.handler);
		if (conn.participantsUpdate) conn.ev.off("group-participants.update", conn.participantsUpdate);
		if (conn.groupsUpdate) conn.ev.off("groups.update", conn.groupsUpdate);
		if (conn.onDelete) conn.ev.off("message.delete", conn.onDelete);
		if (conn.connectionUpdate) conn.ev.off("connection.update", conn.connectionUpdate);
	};
	
	if (opts.handler) {
		if (opts.handler?.handler)  conn.handler = opts.handler.handler.bind(conn);
		if (opts.handler?.participantsUpdate) conn.participantsUpdate = opts.handler.participantsUpdate.bind(conn);
		if (opts.handler?.groupsUpdate) conn.groupsUpdate = opts.handler.groupsUpdate.bind(conn);
		if (opts.handler?.deleteUpdate) conn.onDelete = opts.handler.deleteUpdate.bind(conn);
		if(opts.handler?.pollUpdate) conn.pollUpdate = opts.handler.pollUpdate.bind(conn);
	};
	
	if (!opts.isChild) conn.connectionUpdate = connectionUpdate.bind(conn, opts);
	conn.credsUpdate = opts.authState?.saveCreds.bind(conn);
	
	if (conn.handler) conn.ev.on("messages.upsert", conn.handler);
	if (conn.participantsUpdate) conn.ev.on("group-participants.update", conn.participantsUpdate);
	if (conn.groupsUpdate) conn.ev.on("groups.update", conn.groupsUpdate);
	if (conn.onDelete) conn.ev.on("message.delete", conn.onDelete);
	if (conn.connectionUpdate) conn.ev.on("connection.update", conn.connectionUpdate);
	if (conn.credsUpdate) conn.ev.on("creds.update", conn.credsUpdate);
	if(conn.pollUpdate) conn.ev.on("messages.update", conn.pollUpdate);
    store.bind(conn.ev)
  		conn.isReloadInit = false;
	return true;
};

export function messageConfig() {
	return {
		welcome: '✧━━━━━━[ *こんにちは* ]━━━━━━✧\n\n┏––––––━━━━━━━━•\n│⫹⫺ @subject\n┣━━━━━━━━┅┅┅\n│( 👋 Hallo @user)\n├[ *INTRO* ]—\n│ *Nama:* \n│ *Umur:* \n│ *Gender:*\n┗––––––━━┅┅┅\n\n––––┅┅ *DESCRIPTION* ┅┅––––\n@desc',
		bye: '✧━━━━━━[ *さよなら* ]━━━━━━✧\nSayonara *@user* 👋( ╹▽╹ )',
		spromote: '@user sekarang admin!',
		sdemote: '@user sekarang bukan admin!',
		sDesc: 'Deskripsi telah diubah ke \n@desc',
		sSubject: 'Judul grup telah diubah ke \n@subject',
		sIcon: 'Icon grup telah diubah!',
		sRevoke: 'Link group telah diubah ke \n@revoke'
	};
};

async function connectionUpdate(opts, update) {
	const { receivedPendingNotifications, connection, lastDisconnect, isOnline, isNewLogin } = update;
	
	if (connection == 'connecting') console.log(chalk.redBright('Mengaktifkan Bot, Mohon tunggu sebentar...'));
	if (connection == 'open') console.log(chalk.green('Tersambung'));
	if (isOnline == true) console.log(chalk.green('Status Aktif'));
	if (isOnline == false) console.log(chalk.red('Status Mati'));
	if (receivedPendingNotifications) console.log(chalk.yellow('Menunggu Pesan Baru'));
	if (connection == "close") {
		console.log(chalk.red('koneksi terputus & mencoba menyambung ulang...'));
	};
	
	const status = lastDisconnect?.error?.output?.statusCode || lastDisconnect?.error?.output?.payload?.statusCode;
	if (status) {
		if (status !== DisconnectReason.loggedOut && status !== DisconnectReason.blockedNumber) {
			console.log({ status, message: lastDisconnect.error?.output?.payload?.message ?? "", disconnectReason: DisconnectReason[status] });
			console.log(chalk.red('Connecting...'));
			console.log(await reload(this, true, opts).catch(console.error));
		} else if (status === DisconnectReason.loggedOut || status === DisconnectReason.forbidden) {
			console.log(chalk.red('Bot di logout, silahkan login ulang!'));
			if (existsSync(join(authFolder, "parent"))) await promises.rm(join(authFolder, "parent"), { recursive: true }).catch(console.error);
		};
	};
	
	if (global.db.data == null) await global.loadDatabase();
};

async function importFile(module) {
	module = resolve(module);
	module = await import(`${module}?id=${Date.now()}`);
	module = module && module.default ? module.default : module;
	return module;
};

export const opts = {
	authState,
	isChild: false
};

export default {
	opts,
	conn,
	conns,
	
	logger,
	authState,
	authFolder,
	
	start,
	reload,
	messageConfig
};