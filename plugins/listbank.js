let handler = async (m, { conn }) => {
    const banks = {
        "ALLO BANK INDONESIA": "567",
        "BANGKOK BANK": "040",
        "BANK ACEH SYARIAH": "116",
        "BANK ALADIN SYARIAH": "947",
        "BANK AMAR INDONESIA": "531",
        "BANK ANZ INDONESIA": "061",
        "BANK ARTHA GRAHA INTERNASIONAL": "037",
        "BANK BANTEN": "137",
        "BANK BCA": "014",
        "BANK BCA SYARIAH": "536",
        "BANK BENGKULU": "133",
        "BANK BISNIS INTERNASIONAL": "459",
        "BANK BJB": "110",
        "BANK BJB SYARIAH": "425",
        "BANK BNI": "009",
        "BANK BNP PARIBAS INDONESIA": "057",
        "BANK BRI": "002",
        "BANK BSI": "451",
        "BANK BTN": "200",
        "BANK BTPN": "213",
        "BANK BTPN SYARIAH": "547",
        "BANK BUMI ARTA": "076",
        "BANK CAPITAL INDONESIA": "054",
        "BANK CCB INDONESIA": "036",
        "BANK CIMB NIAGA": "022",
        "BANK COMMONWEALTH": "950",
        "BANK CTBC INDONESIA": "949",
        "BANK DANAMON": "011",
        "BANK DBS INDONESIA": "046",
        "BANK DIGITAL BCA": "501",
        "BANK DKI": "111",
        "BANK DKI SYARIAH": "724",
        "BANK GANESHA": "161",
        "BANK HSBC INDONESIA": "087",
        "BANK IBK INDONESIA": "945",
        "BANK ICBC INDONESIA": "164",
        "BANK INA PERDANA": "513",
        "BANK INDEX SELINDO": "555",
        "BANK J TRUST INDONESIA": "095",
        "BANK JAGO": "542",
        "BANK JASA JAKARTA": "472",
        "BANK JATENG": "113",
        "BANK JATIM": "114",
        "BANK KALBAR": "123",
        "BANK KALTIMTARA": "124",
        "BANK KB BUKOPIN": "441",
        "BANK KB BUKOPIN SYARIAH": "521",
        "BANK KEB HANA": "484",
        "BANK LAMPUNG": "121",
        "BANK MALUKU MALUT": "131",
        "BANK MANDIRI": "008",
        "BANK MANDIRI TASPEN": "564",
        "BANK MASPION INDONESIA": "157",
        "BANK MAYAPADA": "097",
        "BANK MAYORA": "553",
        "BANK MEGA": "426",
        "BANK MEGA SYARIAH": "506",
        "BANK MESTIKA DHARMA": "151",
        "BANK MIZUHO INDONESIA": "048",
        "BANK MNC INTERNASIONAL": "485",
        "BANK MUAMALAT INDONESIA": "147",
        "BANK MULTIARTA SENTOSA": "548",
        "BANK NAGARI": "118",
        "BANK NATIONALNOBU": "503",
        "BANK NEO COMMERCE": "490",
        "BANK NTB SYARIAH": "128",
        "BANK NTT": "130",
        "BANK OCBC NISP": "028",
        "BANK PANIN": "019",
        "BANK PERMATA": "013",
        "BANK RIAU KEPRI": "119",
        "BANK SAHABAT SAMPOERNA": "523",
        "BANK SINARMAS": "153",
        "BANK SUMITOMO MITSUI INDONESIA": "045",
        "BANK SUMSEL BABEL": "120",
        "BANK SUMUT": "117",
        "BANK UOB INDONESIA": "023",
        "BANK WOORI SAUDARA": "212",
        "BPD BALI": "129",
        "BPD DIY": "112",
        "MAYBANK INDONESIA": "016",
        "MUFG BANK": "042",
        "SEABANK INDONESIA": "535",
        "STANDARD CHARTERED BANK": "050"
    };

    const ewalet = {
        "DANA": "DANA EWALLET",
        "GOPAY": "GOPAY",
        "GOPAYDRIVER": "GOPAY DRIVER",
        "KASPRO": "KASPRO",
        "LINKAJA": "LINKAJA",
        "OVO": "OVO",
        "SHOPEEPAY": "SHOPEEPAY"
    };

    // Format daftar bank
    let response = '🏦 *Daftar Bank dan E-Wallet*\n\n';
    response += '*📋 Daftar Bank:*\n';
    for (let [name, code] of Object.entries(banks)) {
        response += `- ${name}: *${code}*\n`;
    }

    response += '\n*📱 Daftar E-Wallet:*\n';
    for (let [code, name] of Object.entries(ewalet)) {
        response += `- ${name} (${code})\n`;
    }

    response += `\nGunakan kode ini untuk transaksi kamu!`;

    // Kirim daftar ke pengguna
    conn.reply(m.chat, response, m);
};

handler.help = ['listbank', 'listewalet'];
handler.tags = ['premium'];
handler.command = /^(listbank|listewalet)$/i;

export default handler;