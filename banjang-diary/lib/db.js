const crypto = require('crypto');
const URL_ = process.env.SUPABASE_URL;
const KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

async function sb(path, { method = 'GET', body, prefer } = {}) {
  const r = await fetch(`${URL_}/rest/v1/${path}`, {
    method,
    headers: {
      apikey: KEY, Authorization: `Bearer ${KEY}`,
      'Content-Type': 'application/json',
      ...(prefer ? { Prefer: prefer } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!r.ok) throw new Error(`DB ${r.status}`);
  const t = await r.text();
  return t ? JSON.parse(t) : null;
}

// 브라우저가 만든 랜덤 ID를 해시해 사용 순서 번호(사용자N)로 변환
async function getUserNo(anonId) {
  const h = crypto.createHash('sha256').update(String(anonId)).digest('hex');
  let rows = await sb(`users?anon_hash=eq.${h}&select=user_no`);
  if (rows.length) return rows[0].user_no;
  try {
    rows = await sb('users', { method: 'POST', body: { anon_hash: h }, prefer: 'return=representation' });
    return rows[0].user_no;
  } catch {
    rows = await sb(`users?anon_hash=eq.${h}&select=user_no`); // 동시 요청 경합 대비
    return rows[0].user_no;
  }
}

module.exports = { sb, getUserNo };
