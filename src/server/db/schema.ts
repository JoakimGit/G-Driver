import { singlestoreTable, int, text } from "drizzle-orm/singlestore-core";

export const users = singlestoreTable("users-table", {
  id: int("id").primaryKey().autoincrement(),
  name: text("name"),
  age: int("email"),
})