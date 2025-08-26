// bayeight/lp20250826/api/submit.js
const { google } = require('googleapis');

module.exports = async (req, res) => {
    if (req.method !== 'POST') {
        res.status(405).send('Method Not Allowed');
        return;
    }

    // x-www-form-urlencoded を手動パース
    const body = await new Promise((resolve) => {
        let data = '';
        req.on('data', (c) => (data += c));
        req.on('end', () => resolve(data));
    });
    const params = new URLSearchParams(body);

    const row = [
        new Date().toISOString(),
        params.get('name') || '',
        params.get('grade') || '',
        params.get('phone') || '',
        params.get('email') || '',
        params.get('message') || '',
        params.get('utm_source') || '',
        params.get('utm_campaign') || '',
    ];

    try {
        const auth = new google.auth.JWT(
            process.env.GOOGLE_SA_EMAIL,
            null,
            (process.env.GOOGLE_SA_PRIVATE_KEY || '').replace(/\\n/g, '\n'),
            ['https://www.googleapis.com/auth/spreadsheets']
        );

        const sheets = google.sheets({ version: 'v4', auth });
        const spreadsheetId = process.env.GOOGLE_SHEETS_ID;
        const sheetName = process.env.GOOGLE_SHEETS_TAB || 'responses';

        // ヘッダーが無い時に自動付与（A1 先頭セル見て判断）
        try {
            await sheets.spreadsheets.values.get({
                spreadsheetId,
                range: `${sheetName}!A1:A1`,
            });
        } catch {
            await sheets.spreadsheets.values.update({
                spreadsheetId,
                range: `${sheetName}!A1:H1`,
                valueInputOption: 'RAW',
                requestBody: {
                    values: [[
                        'timestamp', 'name', 'grade', 'phone', 'email', 'message', 'utm_source', 'utm_campaign'
                    ]]
                }
            });
        }

        // 追記
        await sheets.spreadsheets.values.append({
            spreadsheetId,
            range: `${sheetName}!A1`,
            valueInputOption: 'RAW',
            insertDataOption: 'INSERT_ROWS',
            requestBody: { values: [row] },
        });

        // hidden iframe 用に軽いHTML返す
        res.setHeader('Content-Type', 'text/html; charset=utf-8');
        res.status(200).send('<!doctype html><meta charset="utf-8">OK');
    } catch (err) {
        console.error(err);
        res.setHeader('Content-Type', 'text/html; charset=utf-8');
        res.status(500).send('<!doctype html><meta charset="utf-8">NG');
    }
};
