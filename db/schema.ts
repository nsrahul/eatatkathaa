import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const reservations = sqliteTable("reservations", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  phone: text("phone").notNull(),
  date: text("date").notNull(),
  guests: text("guests").notNull(),
  note: text("note"),
  status: text("status").notNull().default("requested"),
  createdAt: text("created_at").notNull(),
});
