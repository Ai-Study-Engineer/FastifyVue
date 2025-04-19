export const answerList = [
  {
    id: 1,
    query: "SELECT * FROM users;",
    columns: ["id", "name", "age"],
    rows: [
      { id: 1, name: "Alice", age: 25 },
      { id: 2, name: "Bob", age: 30 },
      { id: 3, name: "Charlie", age: 19 }
    ]
  },
  {
    id: 2,
    query: "SELECT * FROM users WHERE age >= 20;",
    columns: ["id", "name", "age"],
    rows: [
      { id: 1, name: "Alice", age: 25 },
      { id: 2, name: "Bob", age: 30 }
    ]  
  },
  {
    id: 3,
    query: "SELECT id, name FROM products;",
    columns: ["id", "name"],
    rows: [
      { id: 1, name: "Product A"},
      { id: 2, name: "Product B"},
      { id: 3, name: "Product C"}
    ]
  }
];
