const crypto = require('crypto');
const { sb } = require('../lib/db');
const { SURVEY_QUESTIONS } = require('../lib/config');

const safeEq = (a, b) => {
  const x = crypto.createHash('sha256').update(String(a)).digest();
  const y = crypto.createHash('sha256').update(String(b)).digest();
  return crypto.timingSafeEqual(x, y);
};

module.exports = async (req, res) => {
  const pw = process.env.ADMIN_PASSWORD;
  if (!pw || !safeEq(req.headers['x-admin-password'] || '', pw)) return res.status(401).json({ error: 'unauthorized' });
  try {
    const rows = await sb('entries?select=id,user_no,char_count,empty_fields,created_at,surveys(rating,answers,created_at)&order=created_at.desc&limit=1000');
    const entries = rows.map((e) => {
      const s = Array.isArray(e.surveys) ? e.surveys[0] : e.surveys;
      return { user: `사용자${e.user_no}`, createdAt: e.created_at, charCount: e.char_count,
               emptyFields: e.empty_fields, rating: s?.rating ?? null, answers: s?.answers ?? null };
    });
    res.status(200).json({ questions: SURVEY_QUESTIONS, entries });
  } catch (e) {
    console.error('admin error:', e.message);
    res.status(500).json({ error: 'server error' });
  }
};
