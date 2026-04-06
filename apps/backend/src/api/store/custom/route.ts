import type { Request, Response } from "express";

export async function GET(
  req: Request,
  res: Response
) {
  res.sendStatus(200);
}
