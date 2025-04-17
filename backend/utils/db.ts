import Database from 'better-sqlite3';

const db = new Database('sample.db');

// 毎回完全に初期化
db.exec(`
  DROP TABLE IF EXISTS users;

  CREATE TABLE users (
    id INTEGER PRIMARY KEY,
    name TEXT,
    age INTEGER
  );

  INSERT INTO users (name, age)
  VALUES
    ('Alice', 25),
    ('Bob', 30),
    ('Charlie', 19);
`);

export { db };
