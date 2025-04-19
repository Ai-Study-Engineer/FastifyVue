import { title } from "process";
import { usersDB, productsDB } from './utils/db';

export const questionList = [
    {
      id: 1,
      title: "全てのユーザーを取得する",
      DB: usersDB,
      DBNAME: "users"
    },
    {
      id: 2,
      title: "年齢が20以上のユーザーを取得する",
      DB: usersDB,
      DBNAME: "users"
    },
    {
      id: 3,
      title: "全ての商品名を取得する",
      DB: productsDB,
      DBNAME: "products"
    }
  ];
  