// api/submit.js
module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ ok: false, error: 'Method Not Allowed' });
    return;
  }

  try {
    const raw = await streamToString(req);
    const params = new URLSearchParams(raw);
    const data = Object.fromEntries(params.entries());

    for (const k of ['name', 'email', 'phone', 'grade']) {
      if (!data[k]) {
        res.status(400).json({ ok: false, error: `Missing: ${k}` });
        return;
      }
    }

    const payload = {
      ...data,
      _ts: new Date().toISOString(),
      _ua: req.headers['user-agent'] || '',
      _ip: (req.headers['x-forwarded-for'] || '')
        .split(',')[0]
        .trim() ||
        (req.socket && req.socket.remoteAddress) ||
        ''
    };

    // ===== Google Apps Scriptへ転送 =====
    const GAS_URL = process.env.https://script.google.com/macros/s/AKfycbwch-5Pgg5YXrC6uNR-4W8NMe3ufqOf41JMdVvruz5U85WUL20bJ6pa9oHVCkp6UEbwQw/exec;
    let gasResp = null;
    if (GAS_URL) {
      const r = await fetch(GAS_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      gasResp = await safeJson(r);
    }

    res.status(200).json({ ok: true, sheet: gasResp });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, error: 'Server Error' });
  }
};

// ===== helper =====
function streamToString(req) {
  return new Promise((resolve, reject) => {
    let data = '';
    req.setEncoding('utf8');
    req.on('data', (chunk) => (data += chunk));
    req.on('end', () => resolve(data));
    req.on('error', reject);
  });
}

async function safeJson(r) {
  try { return await r.json(); } catch { return { ok: r.ok, status: r.status }; }
}
