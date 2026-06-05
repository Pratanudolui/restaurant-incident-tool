import Database from 'better-sqlite3';
import path from 'path';

const DB_PATH = path.join(process.cwd(), 'incidents.db');

let db;

function getDb() {
  if (!db) {
    db = new Database(DB_PATH);
    db.pragma('journal_mode = WAL');
    db.exec(`
      CREATE TABLE IF NOT EXISTS incidents (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        description TEXT NOT NULL,
        category TEXT NOT NULL,
        store_location TEXT NOT NULL,
        severity TEXT NOT NULL,
        status TEXT DEFAULT 'Open',
        reported_at TEXT NOT NULL,
        ai_summary TEXT,
        created_at TEXT DEFAULT (datetime('now'))
      );
    `);
  }
  return db;
}

export default getDb;