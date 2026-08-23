import jwt from "jsonwebtoken";
import { AuthTokenPayload } from "../types";

const JWT_SECRET = process.env.JWT_SECRET || "dev_secret_troque_em_producao";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";

export function signToken(payload: AuthTokenPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

export function verifyToken(token: string): AuthTokenPayload {
  return jwt.verify(token, JWT_SECRET) as AuthTokenPayload;
}
