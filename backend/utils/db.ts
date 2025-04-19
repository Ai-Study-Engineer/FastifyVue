import Database, { Database as DatabaseType } from 'better-sqlite3';

type CustomDatabase = DatabaseType & {
  toString(): string;
};

function createCustomDB(path: string): CustomDatabase {
  const db = new Database(path);

  return new Proxy(db, {
    get(target, prop, receiver) {
      if (prop === 'toString') {
        return () => path.replace(/\.db$/, '');
      }
      return Reflect.get(target, prop, receiver);
    }
  }) as CustomDatabase;
}

const usersDB = createCustomDB('users.db');

// 毎回完全に初期化
usersDB.exec(`
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

const productsDB = createCustomDB('products.db');
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

export { usersDB as usersDB };
export { productsDB as productsDB };
