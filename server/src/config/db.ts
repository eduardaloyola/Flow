import fs from "fs";
import path from "path";
import { Database } from "../types";

// Persistência simples em arquivo JSON.
// Ideal para portfólio/demonstração: zero dependências externas de banco,
// fácil de ler e rodar em qualquer máquina sem configurar SGBD.
// Em um projeto real de produção, isso seria substituído por Postgres/Mongo etc.

const DB_PATH = path.join(__dirname, "..", "data", "db.json");

function ensureDbFile(): void {
  if (!fs.existsSync(DB_PATH)) {
    const initial: Database = { users: [], tasks: [] };
    fs.writeFileSync(DB_PATH, JSON.stringify(initial, null, 2), "utf-8");
  }
}

export function readDb(): Database {
  ensureDbFile();
  const raw = fs.readFileSync(DB_PATH, "utf-8");
  return JSON.parse(raw) as Database;
}

export function writeDb(data: Database): void {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), "utf-8");
}
