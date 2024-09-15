import { FastifyReply, FastifyRequest } from "fastify"
import { ICreateUser } from "../routes/create-user"
import { generatePasswordHash } from "../utils/password-hash-generate";
import { getUserService } from "../services/users-services/get-user-service";
import { jwtGenerate } from "../utils/jwt-generate";
import { createUserService } from "../services/users-services/create-user-service";

export async function createUserController(req: FastifyRequest<ICreateUser>, res: FastifyReply) {
    const {name, email, password} = req.body;

    const emaillreadyRegistered = await getUserService(email);
    if (emaillreadyRegistered) res.status(409).send({error: true, message: `Usuário ${email} já está cadastrado`})

    const hash = await generatePasswordHash(password);

    const token = jwtGenerate({id: null, name: name, email: email, password: hash });

    const user =  await createUserService(name ? name : '', email, hash, token);

    const userData = {id: user.id, name: user.name, email: user.email, token: user.token}
    
    res.status(201).send({error: false, message: `Usuário cadastrado`, user: userData});

}