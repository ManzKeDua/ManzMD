const maxJadibot = `3`;
let listrestart = []
let restartTime = 5 * 60 * 60 * 1000
let first = false
import { join } from 'path';
import { existsSync, promises as fsPromises } from 'fs';
import { delay, DisconnectReason, areJidsSameUser, jidNormalizedUser, useMultiFileAuthState } from '@adiwajshing/baileys';
import connection, { start, reload, authFolder } from './connection.js';

export default async function startJadibot(userJid, messageHandler, message = null) {
    if (global.db?.data == null) {
        await global?.loadDatabase?.();
    }
    userJid = jidNormalizedUser(userJid);
    if (userJid && userJid.startsWith('0')) {
        userJid = '62' + userJid.slice(1);
    }
    const userId = userJid && userJid.split('@')[0];
    if (!userId) {
        throw "Please enter user jid to start Jadibot!";
    }
    if (global.db?.data && global.db.data !== null && typeof global.db.data === "object") {
        let users = global.db.data.users;
        if (!(userJid in users)) {
            users[userJid] = {
                'premium': false,
                'premiumTime': 0,
                'vip': false,
                'vipDate': 0,
                'jadibot': 0
            };
        }
        if (!users[userJid].vip && users[userJid].jadibot >= maxJadibot && Date.now() >= users[userJid].vipDate) {
            if (message && messageHandler) {
                await messageHandler.reply(message.chat, "Anda telah mencapai batas Jadibot, silakan berlangganan premium untuk terus menggunakan Jadibot!", message);
            }
            return;
        }
    }

    const bot = await initializeBot(userJid, messageHandler, message);
    if (bot && bot?.user?.jid && !areJidsSameUser(bot.user.jid, userJid)) {
        console.log("Adjusting session name for:", userJid);
        const sessionEntry = [...connection.conns.entries()].find(([_, conn]) => areJidsSameUser(conn.user.jid, bot.user.jid));
        try {
            await bot.end();
            const oldSessionPath = join(authFolder, userJid.split('@')[0]);
            const newSessionPath = join(authFolder, bot.user.jid.split('@')[0]);
            console.log(`Renaming session from ${oldSessionPath} to ${newSessionPath}`);
            await fsPromises.rename(oldSessionPath, newSessionPath);
            userJid = bot.user.jid;
            console.log("Session name successfully changed!");
        } catch (error) {
            console.error(error, "Failed to change session name!");
        }
        if (sessionEntry) {
            connection.conns.delete(sessionEntry[0]);
        }
        await delay(3000);
        return await startJadibot(userJid, messageHandler, message);
    }

    if (global.db?.data && global.db.data !== null && typeof global.db.data === "object") {
        if (!(userJid in global.db.data.users)) {
            global.db.data.users[userJid] = {
                'premium': false,
                'premiumTime': 0,
                'vip': false,
                'vipDate': 0,
                'jadibot': 0
            };
        }
        const botForFree = 1;
        let user = global.db.data.users[userJid];
        if (!user.vip) {
            user.jadibot++;
            user.vip = true;
            user.vipDate = Date.now() + (86400000 * botForFree)
        }
    }

    return bot;
}


export async function initializeBot(userJid, messageHandler, message) {
    const userId = userJid.split('@')[0];
    const sessionPath = join(authFolder, userId);
    const activeUserJids = [...connection.conns.entries()].map(([_, conn]) => conn?.user?.jid);
    const authState = await useMultiFileAuthState(sessionPath);
    const options = {
        authState,
        isChild: true
    };
    const bot = await start(null, options);
    const sendMessage = async (...args) => {
        return messageHandler && messageHandler?.reply ? messageHandler.reply(...args) : console.log(...args);
    };
    let pairingCode;
    if (!bot.authState?.creds?.registered) {
        console.log("Getting pairing code...");
        await delay(1500);
        const recipient = message && (message.sender || message.chat);
        try {
            pairingCode = await bot.requestPairingCode(userId);
            pairingCode = pairingCode?.match(/.{1,4}/g)?.join('-') || pairingCode;
            const replyMessage = await sendMessage(recipient, ('' + pairingCode).trim(), message);
            await sendMessage(recipient, "Pairing code received, please link now!", replyMessage);
        } catch (error) {
            console.error(error);
            if (message) {
                return await sendMessage(message.chat, "Failed to get pairing code!", message);
            }
        }
    }
    bot.ev.on("connection.update", async update => {
        const {
            connection: connectionState,
            lastDisconnect,
            isNewLogin,
            receivedPendingNotifications
        } = update;
        const statusCode = lastDisconnect?.error?.output?.statusCode || lastDisconnect?.error?.output?.payload?.statusCode;
        const statusMessage = lastDisconnect?.error?.output?.payload?.message ?? '';
        if (connectionState == "close") {
            bot.logger.error(`STATE: close!\nID: ${userId}\nStatus: ${statusCode ?? 0}\nMessage: ${statusMessage}\nDisconnect Reason: ${DisconnectReason[statusCode] ?? 0}`);
        } else if (connectionState == 'open') {
            const user = global.db.data?.users?.[userJid];
            bot.logger.info(`STATE: open!\nID: ${userId}\nName: ${bot.user?.name}\nExpired: ${user && user?.vip && user?.vipDate != 0 ? (user.vipDate - Date.now()).toTimeString() : 0}`);
            if (message) {
                await sendMessage(message.chat, "Successfully connected!", message);
            }
        } else if (connectionState) {
            bot.logger.info(`STATE: ${connectionState}\nID: ${userId}\nName: ${bot?.user?.name}`);
        }

        if (statusCode) {
            console.log({
                'status': statusCode,
                'message': statusMessage,
                'reason': DisconnectReason[statusCode]
            });
            if (statusCode && DisconnectReason[statusCode] && statusCode !== DisconnectReason.loggedOut && statusCode !== DisconnectReason.timedOut && statusCode !== DisconnectReason.badSession && statusCode !== DisconnectReason.blockedNumber) {
                await reload(bot, true, options).catch(console.error);
            } else if (statusCode === DisconnectReason.timedOut) {
                console.log("Connection timeout!", {
                    'conns': connection.conns.has(userId),
                    'registered': bot.authState?.creds?.registered
                });
                if (message && !bot.authState?.creds?.registered && pairingCode) {
                    await message.reply("Kode pasangan telah kedaluwarsa!");
                    if (existsSync(sessionPath)) {
                        await fsPromises.rm(sessionPath, { 'recursive': true }).catch(error => console.error(error, "Failed to remove auth folder!"));
                    }
                } else if (bot.authState?.creds?.registered) {
                    bot.logger.info("\nReloading connection!");
                    await reload(bot, true, options);
                }
            } else if (statusCode === DisconnectReason.blockedNumber || statusCode === DisconnectReason.loggedOut) {
                if (existsSync(sessionPath)) {
                    await fsPromises.rm(sessionPath, { 'recursive': true }).catch(error => console.error(error, "Failed to remove session in " + sessionPath));
                }
                if (connection.conns.has(userId)) {
                    connection.conns.delete(userId);
                }
                const jid = bot?.user?.jid ? bot.user.jid : userJid;
                const messageText = statusCode === DisconnectReason.blockedNumber ? "Nomor Anda telah diblokir dari WhatsApp, Jadibot berhenti!" : "Anda telah keluar dari Jadibot!\nSilakan tautkan lagi untuk menjadi bot!";
                await sendMessage(jid, messageText, message);
            }
        }

        if (receivedPendingNotifications) {
            if (message) {
                await sendMessage(message.chat, `status: pending notification for bot @${userId}`, message, { 'mentions': [userJid] });
            }
            bot.logger.info(`STATE: pending\nID: ${userId}!`);
        }

        if (isNewLogin) {
            if (message) {
                let reply = await message.reply("Successfully connected!");
                await delay(1000);
                await bot.reply(message.chat, "Successfully connected to your bot", reply);
                let user = global.db.data.users[userJid];
                if (user) {
                    const info = (`\nSuccessfully connected to your WhatsApp.\n\nID: ${userId}\nExpired: ${user.vip && user.vipDate != 0 ? (user.vipDate - Date.now()).toTimeString() : 0}\n\n*NOTE: this is just temporary!*\n`).trim();
                    await sendMessage(userJid, info, message);
                }
            }
            bot.logger.info(`New Login with ${userId}`);
        }
    });
    bot.ev.on("creds.update", async saveCreds => {
      try{
        if (userJid in connection.conns && connection.conns[userJid].authState?.creds) {
            await connection.conns[userJid].authState.saveCreds();
        } else if (bot?.authState?.creds) {
            await bot.authState.saveCreds();
        } else if (saveCreds) {
            await authState.saveCreds();
        }
       } catch {}
    });
    
    setInterval(async () => {
                   console.log("Restarting Jadibot "+ userJid +"...");
                   await reload(bot, true, options);
    }, restartTime);//5jam mang
    
    if (bot?.user?.jid && !activeUserJids.includes(bot.user.jid)) {
        bot.user.jid = userJid;
        connection.conns.set(userId, bot);
        return bot;
    }
}

/**
 * Created by Fokus ID
 * Thanks to Github Copilot for translating the code
 */

export async function restoreSession(conn) {
    const sessionDirectory = authFolder;
    
    if (!existsSync(sessionDirectory)) {
        await fsPromises.mkdir(sessionDirectory, {
            recursive: true
        });
    }
    
    const sessionList = (await fsPromises.readdir(sessionDirectory)).filter(a => a !== "parent")
    
    if (sessionList.length) {
        for (const sessionName of sessionList) {
            await delay(50000);
            if (!parseInt(sessionName)) {
                continue;
            }
            
            const sessionPath = join(sessionDirectory, sessionName);
            const activeBotJids = [...connection.conns.entries()].map(([_, conn]) => conn?.user?.jid || jidNormalizedUser(conn?.user?.id));
            
            if (existsSync(join(sessionPath, "creds.json"))) {
                if (activeBotJids.includes(sessionName + "@s.whatsapp.net")) {
                    continue;
                }
                
                console.log(`Restoring session: ${sessionName}`);
                await startJadibot(sessionName + "@s.whatsapp.net", conn, null)
                if(!listrestart.includes(sessionName)){
                    listrestart.push(sessionName)
                    await startJadibot(sessionName + "@s.whatsapp.net", conn, null);
                }
                
                return
            }
        }
    }
}