import { FastifyReply, FastifyRequest } from "fastify";
import { getToken } from "../utils/get-token";
import z from "zod";

const userSchema = z.object({
  id: z.string(),
  name: z.string().nullable(),
  email: z.string(),
  password: z.string(),
});

type TUser = z.infer<typeof userSchema>;

declare module 'fastify' {
  interface FastifyRequest {
    User: TUser;
  }
}

export async function authMiddleware(
  req: FastifyRequest,
  res: FastifyReply
) {
  console.log('entrou no middleware')
  try {
    const authHeader = getToken(req.headers.authorization);
    if (authHeader) {
      req.User = authHeader.payload;
    } else {
      res.status(401).send({ error: true, message: 'Token inválido ou ausente' });
    }
  } catch (error) {
    res.status(401).send({ error: true, message: 'Erro na tentativa de login' });
  }
}
