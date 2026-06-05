import getDb from '../../../lib/db';

export async function GET(request) {
  const db = getDb();
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category');
  const severity = searchParams.get('severity');
  const status = searchParams.get('status');
  const search = searchParams.get('search');

  let query = 'SELECT * FROM incidents WHERE 1=1';
  const params = [];

  if (category && category !== 'All') {
    query += ' AND category = ?';
    params.push(category);
  }
  if (severity && severity !== 'All') {
    query += ' AND severity = ?';
    params.push(severity);
  }
  if (status && status !== 'All') {
    query += ' AND status = ?';
    params.push(status);
  }
  if (search) {
    query += ' AND (title LIKE ? OR description LIKE ? OR store_location LIKE ?)';
    params.push(`%${search}%`, `%${search}%`, `%${search}%`);
  }

  query += ' ORDER BY created_at DESC';
  const incidents = db.prepare(query).all(...params);
  return Response.json(incidents);
}

export async function POST(request) {
  const db = getDb();
  const body = await request.json();
  const { title, description, category, store_location, severity, reported_at } = body;

  if (!title || !description || !category || !store_location || !severity || !reported_at) {
    return Response.json({ error: 'All fields are required' }, { status: 400 });
  }

  // AI Summary via Claude API
  let ai_summary = null;
  try {
    const aiRes = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 150,
        system: 'You are a restaurant operations assistant. Given an incident report, write a concise 1-2 sentence summary and suggest the correct category and severity. Respond in JSON: { "summary": "...", "suggested_category": "...", "suggested_severity": "..." }',
        messages: [{ role: 'user', content: `Title: ${title}\nDescription: ${description}\nCategory: ${category}\nSeverity: ${severity}` }]
      })
    });
    const aiData = await aiRes.json();
    const text = aiData.content?.[0]?.text || '';
    const cleaned = text.replace(/```json|```/g, '').trim();
    const parsed = JSON.parse(cleaned);
    ai_summary = parsed.summary;
  } catch (e) {
    ai_summary = null;
  }

  const stmt = db.prepare(
    'INSERT INTO incidents (title, description, category, store_location, severity, reported_at, ai_summary) VALUES (?, ?, ?, ?, ?, ?, ?)'
  );
  const result = stmt.run(title, description, category, store_location, severity, reported_at, ai_summary);
  const newIncident = db.prepare('SELECT * FROM incidents WHERE id = ?').get(result.lastInsertRowid);
  return Response.json(newIncident, { status: 201 });
}