import { FastifyReply, FastifyRequest } from "fastify";
import { IUserLogin } from "../routes/users-login";
import { getToken } from "../utils/get-token";

export async function userLoginController(req: FastifyRequest<IUserLogin>, res: FastifyReply) {

    console.log(req.body)

}