import { env } from "cloudflare:workers";

const createTable = `CREATE TABLE IF NOT EXISTS reservations (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  date TEXT NOT NULL,
  guests TEXT NOT NULL,
  note TEXT,
  status TEXT NOT NULL DEFAULT 'requested',
  created_at TEXT NOT NULL
)`;

export async function POST(request: Request) {
  try {
    const body = await request.json() as Record<string, unknown>;
    const name = String(body.name ?? "").trim().slice(0, 100);
    const phone = String(body.phone ?? "").trim().slice(0, 30);
    const date = String(body.date ?? "").trim().slice(0, 20);
    const guests = String(body.guests ?? "").trim().slice(0, 10);
    const note = String(body.note ?? "").trim().slice(0, 500);
    if (!name || !phone || !date || !guests) return Response.json({ error: "Please complete the required fields." }, { status: 400 });

    await env.DB.prepare(createTable).run();
    await env.DB.prepare("INSERT INTO reservations (name, phone, date, guests, note, created_at) VALUES (?, ?, ?, ?, ?, ?)")
      .bind(name, phone, date, guests, note, new Date().toISOString()).run();
    return Response.json({ ok: true }, { status: 201 });
  } catch {
    return Response.json({ error: "The request could not be saved." }, { status: 500 });
  }
}
