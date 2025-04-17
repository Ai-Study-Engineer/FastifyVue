import Database from 'better-sqlite3';

const userDB = new Database('sample.db');

// 毎回完全に初期化
userDB.exec(`
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

const productsDB = new Database('products.db');
// 毎回完全に初期化
productsDB.exec(`
  DROP TABLE IF EXISTS products;

  CREATE TABLE products (
    id INTEGER PRIMARY KEY,
    name TEXT,
    price REAL
  );

  INSERT INTO products (name, price)
  VALUES
    ('Product A', 10.99),
    ('Product B', 20.50),
    ('Product C', 5.75);
`);

export { userDB as userDB };
export { productsDB as productsDB };
