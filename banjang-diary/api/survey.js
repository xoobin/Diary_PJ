const { sb } = require('../lib/db');
const { SURVEY_QUESTIONS } = require('../lib/config');

module.exports = async (req, res) => {
  if (req.method === 'GET') return res.status(200).json({ questions: SURVEY_QUESTIONS });
  if (req.method !== 'POST') return res.status(405).end();
  try {
    const { entryId, rating, answers = {} } = req.body || {};
    const r = Number(rating);
    if (!entryId || !(r >= 1 && r <= 5)) return res.status(400).json({ error: '1~5점 중 하나를 선택해 주세요.' });

    const clean = {};
    for (const q of SURVEY_QUESTIONS) {
      const v = answers[q.id];
      if (q.type === 'rating') continue; // 별점은 rating 컬럼에 저장
      if (q.type === 'choice') {
        if (!q.options.includes(v)) return res.status(400).json({ error: '모든 문항에 답해 주세요.' });
        clean[q.id] = v;
      } else if (v) clean[q.id] = String(v).slice(0, q.maxLength || 300);
    }
    await sb('surveys', { method: 'POST', body: { entry_id: entryId, rating: r, answers: clean } });
    res.status(200).json({ ok: true });
  } catch (e) {
    console.error('survey error:', e.message);
    res.status(500).json({ error: '제출에 실패했어요. 다시 시도해 주세요.' });
  }
};
