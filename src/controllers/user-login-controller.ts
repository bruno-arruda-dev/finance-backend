import { FastifyReply, FastifyRequest } from "fastify";
import { IUserLogin } from "../routes/users-login";
import { getToken } from "../utils/get-token";
import { getUserService } from "../services/users-services/get-user-service";
import bcrypt from 'bcrypt'
import { jwtGenerate } from "../utils/jwt-generate";
import { updateUserService } from "../services/users-services/update-user-service";

export async function userLoginController(req: FastifyRequest<IUserLogin>, res: FastifyReply) {
    const { email, password } = req.body;

    const user = await getUserService(email);

    if (!user) return res.status(404).send({ error: true, message: 'Usuário não foi encontrado' });

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) res.status(401).send({ error: true, message: 'Senha incorreta' });

    const updatedToken = jwtGenerate({ id: user.id, name: user.name, email: user.email, password: user.password });

    const updatedUser = await updateUserService(user.id, undefined, undefined, undefined, updatedToken);

    console.log(updatedUser)

    return res.status(201).send({
        error: false,
        message: 'Login realizado com sucesso',
        user: {
            id: updatedUser.id, 
            name: updatedUser.name, 
            email: updatedUser.email, 
            token: updatedUser.token
        }
    })
}