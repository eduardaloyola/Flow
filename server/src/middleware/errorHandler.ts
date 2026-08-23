import { Request, Response, NextFunction } from "express";

export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  console.error("[Erro não tratado]", err);
  res.status(500).json({ message: "Erro interno no servidor." });
}
