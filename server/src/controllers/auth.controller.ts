import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";
import { readDb, writeDb } from "../config/db";
import { signToken } from "../utils/jwt";
import { PublicUser, User } from "../types";

function toPublicUser(user: User): PublicUser {
  return { id: user.id, name: user.name, email: user.email };
}

export function register(req: Request, res: Response): void {
  const { name, email, password } = req.body as {
    name?: string;
    email?: string;
    password?: string;
  };

  if (!name || !email || !password) {
    res.status(400).json({ message: "Nome, e-mail e senha são obrigatórios." });
    return;
  }

  if (password.length < 6) {
    res.status(400).json({ message: "A senha deve ter ao menos 6 caracteres." });
    return;
  }

  const db = readDb();
  const emailNormalized = email.trim().toLowerCase();
  const exists = db.users.find((u) => u.email === emailNormalized);

  if (exists) {
    res.status(409).json({ message: "Já existe uma conta com este e-mail." });
    return;
  }

  const passwordHash = bcrypt.hashSync(password, 10);

  const newUser: User = {
    id: uuidv4(),
    name: name.trim(),
    email: emailNormalized,
    passwordHash,
    createdAt: new Date().toISOString(),
  };

  db.users.push(newUser);
  writeDb(db);

  const token = signToken({ userId: newUser.id });

  res.status(201).json({ token, user: toPublicUser(newUser) });
}

export function login(req: Request, res: Response): void {
  const { email, password } = req.body as { email?: string; password?: string };

  if (!email || !password) {
    res.status(400).json({ message: "E-mail e senha são obrigatórios." });
    return;
  }

  const db = readDb();
  const emailNormalized = email.trim().toLowerCase();
  const user = db.users.find((u) => u.email === emailNormalized);

  if (!user || !bcrypt.compareSync(password, user.passwordHash)) {
    res.status(401).json({ message: "E-mail ou senha inválidos." });
    return;
  }

  const token = signToken({ userId: user.id });

  res.json({ token, user: toPublicUser(user) });
}

export function me(req: Request & { userId?: string }, res: Response): void {
  const db = readDb();
  const user = db.users.find((u) => u.id === req.userId);

  if (!user) {
    res.status(404).json({ message: "Usuário não encontrado." });
    return;
  }

  res.json({ user: toPublicUser(user) });
}
