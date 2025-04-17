import Database from 'better-sqlite3';

const db = new Database('sample.db');

// 初期化（必要なら）
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY,
    name TEXT,
    age INTEGER
  );

  INSERT INTO users (name, age)
  SELECT 'Alice', 25
  UNION SELECT 'Bob', 30
  UNION SELECT 'Charlie', 19;
`);

export { db };
