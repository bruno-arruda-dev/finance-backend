import { FastifyReply, FastifyRequest } from "fastify";
import { ICreateUser } from "../routes/create-user";
import { createUserService } from "../services/users-services/create-user-service";
import { getUserService } from "../services/users-services/get-user-service";
import { onCreateUserTriggers } from "../utils/on-create-user-triggers";
import { generatePasswordHash } from "../utils/password-hash-generate";

export async function createUserController(req: FastifyRequest<ICreateUser>, res: FastifyReply) {
    const {name, email, password} = req.body;

    const emaillreadyRegistered = await getUserService(email);
    if (emaillreadyRegistered) return res.status(409).send({error: true, message: `Usuário ${email} já está cadastrado`})

    const hash = await generatePasswordHash(password);

    const user =  await createUserService(email, hash, name ? name : null);

    const userData = {id: user.id, name: user.name, email: user.email, token: user.token}

    await onCreateUserTriggers(user.id);
    
    return res.status(201).send({error: false, message: `Usuário cadastrado`, user: userData});
}