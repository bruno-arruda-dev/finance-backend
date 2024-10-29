import { FastifyReply, FastifyRequest } from "fastify";
import { IUserUpdate } from "../routes/user-update";
import { getToken } from "../utils/get-token";
import bcrypt from 'bcrypt'
import { getUserService } from "../services/users-services/get-user-service";
import { updateUserService } from "../services/users-services/update-user-service";
import { generatePasswordHash } from "../utils/password-hash-generate";
import { jwtGenerate } from "../utils/jwt-generate";

export async function updateUserController(req: FastifyRequest<IUserUpdate>, res: FastifyReply) {
    const { name, email, password, newPassword } = req.body;

    const user = getToken(req.headers.authorization);
    const passwordMatch = password && user?.payload.password ? await bcrypt.compare(password, user?.payload.password) : null
    if (newPassword && !passwordMatch) return res.status(401).send({ error: true, message: 'Senha incorreta' });

    const databaseUser = await getUserService(undefined, user?.payload.id)
    if (!databaseUser) return res.status(400).send({ error: true, message: 'Usuário não encontrado' })

    const hash = newPassword ? await generatePasswordHash(newPassword) : undefined;
    const newToken = jwtGenerate({ id: databaseUser.id, name: name ? name : null, email, password: hash ? hash : user?.payload.password! })

    const updatedUser = user?.payload.id ? await updateUserService(user?.payload.id, name ? name : undefined, email ? email : undefined, hash ? hash : user?.payload.password!, newToken) : null
    console.log(updatedUser)

    return res.status(200).send({
        error: false, message: 'Os dados do usuário foram atualizados', user: updatedUser
    })
}