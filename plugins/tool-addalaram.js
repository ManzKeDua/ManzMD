import fs from 'fs';
import cron from 'node-cron';
import moment from 'moment-timezone';

let alarms = [];

let handler = async (m, { conn, text }) => {
    // Parsing the command
    let [message, time] = text.split('|').map(t => t.trim());
    if (!message || !time) {
        return conn.sendMessage(m.chat, { text: 'Usage: .addalaram <message>|<time>' }, m);
    }

    // Validate the time format
    if (!/^\d{2}:\d{2}$/.test(time)) {
        return conn.sendMessage(m.chat, { text: 'Please provide time in HH:MM format.' }, m);
    }

    // Schedule the alarm
    let [hour, minute] = time.split(':');
    let cronTime = `${minute} ${hour} * * *`;
    let timeZone = 'Asia/Jakarta';
    let alarmTask = cron.schedule(cronTime, () => {
        conn.sendMessage(m.chat, { text: `@${m.sender.split('@')[0]}, reminder: ${message}`, mentions: [m.sender] }, m);
    }, { timezone: timeZone });

    alarms.push({ task: alarmTask, message, time, user: m.sender });
    
    conn.sendMessage(m.chat, { text: `Alarm set for ${time} with message: ${message}` }, m);
};

handler.help = ['addalaram'];
handler.tags = ['premium'];
handler.command = /^(addalaram)$/i;
handler.premium = true;

export default handler;

// To cancel all alarms for a user (e.g., add command .cancelalaram)
handler.cancelAllAlarms = (user) => {
    alarms = alarms.filter(alarm => {
        if (alarm.user === user) {
            alarm.task.stop();
            return false;
        }
        return true;
    });
};
