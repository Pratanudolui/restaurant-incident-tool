import getDb from '../../../../lib/db';

export async function PATCH(request, { params }) {
  const db = getDb();
  const { id } = params;
  const body = await request.json();
  const { status } = body;

  const validStatuses = ['Open', 'In Progress', 'Resolved', 'Closed'];
  if (!validStatuses.includes(status)) {
    return Response.json({ error: 'Invalid status' }, { status: 400 });
  }

  db.prepare('UPDATE incidents SET status = ? WHERE id = ?').run(status, id);
  const updated = db.prepare('SELECT * FROM incidents WHERE id = ?').get(id);
  if (!updated) return Response.json({ error: 'Not found' }, { status: 404 });
  return Response.json(updated);
}

export async function DELETE(request, { params }) {
  const db = getDb();
  const { id } = params;
  const incident = db.prepare('SELECT * FROM incidents WHERE id = ?').get(id);
  if (!incident) return Response.json({ error: 'Not found' }, { status: 404 });
  db.prepare('DELETE FROM incidents WHERE id = ?').run(id);
  return Response.json({ message: 'Deleted successfully' });
}