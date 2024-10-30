import { FastifyReply, FastifyRequest } from "fastify";
import { onCreateUserTriggers } from "../utils/on-create-user-triggers";
import { generatePasswordHash } from "../utils/password-hash-generate";
import { jwtGenerate } from "../utils/jwt-generate";
import bcrypt from 'bcrypt'
import { getToken } from "../utils/get-token";
import { ICreateUser, IPutUserUpdate, IUserLogin } from "../routes/user-routes";
import { UserService } from "../services/user-service";

class UserController {
    static async getUserController(req: FastifyRequest, res: FastifyReply) {
        const tempUser = getToken(req.headers.authorization);
        if (!tempUser) return res.status(400).send({ error: true, message: 'Usuário não encontrado' });
        const user = await UserService.getUserService(undefined, tempUser.payload.id);
        if (!user) return res.status(400).send({ error: true, message: 'Usuário não encontrado' });

        return res.status(200).send({ error: false, message: 'Usuário encontrado', user });
    }

    static async createUserController(req: FastifyRequest<ICreateUser>, res: FastifyReply) {
        const { name, email, password } = req.body;

        const emaillreadyRegistered = await UserService.getUserService(email);
        if (emaillreadyRegistered) return res.status(409).send({ error: true, message: `Usuário ${email} já está cadastrado` })

        const hash = await generatePasswordHash(password);

        const user = await UserService.createUserService(email, hash, name ? name : null);

        const userData = { id: user.id, name: user.name, email: user.email, token: user.token }

        await onCreateUserTriggers(user.id);

        return res.status(201).send({ error: false, message: `Usuário cadastrado`, user: userData });
    }

    static async userLoginController(req: FastifyRequest<IUserLogin>, res: FastifyReply) {
        const { email, password } = req.body;

        const user = await UserService.getUserService(email);

        if (!user) return res.status(404).send({ error: true, message: 'Usuário não foi encontrado' });

        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) res.status(401).send({ error: true, message: 'Senha incorreta' });

        const updatedToken = jwtGenerate({ id: user.id, name: user.name, email: user.email, password: user.password });

        const updatedUser = await UserService.updateUserService(user.id, undefined, undefined, undefined, updatedToken);

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

    static async updateUserController(req: FastifyRequest<IPutUserUpdate>, res: FastifyReply) {
        const { name, email, password, newPassword } = req.body;

        const user = getToken(req.headers.authorization);
        const passwordMatch = password && user?.payload.password ? await bcrypt.compare(password, user?.payload.password) : null
        if (newPassword && !passwordMatch) return res.status(401).send({ error: true, message: 'Senha incorreta' });

        const databaseUser = await UserService.getUserService(undefined, user?.payload.id)
        if (!databaseUser) return res.status(400).send({ error: true, message: 'Usuário não encontrado' })

        const hash = newPassword ? await generatePasswordHash(newPassword) : undefined;
        const newToken = jwtGenerate({ id: databaseUser.id, name: name ? name : null, email, password: hash ? hash : user?.payload.password! })

        const updatedUser = user?.payload.id ? await UserService.updateUserService(user?.payload.id, name ? name : null, email ? email : undefined, hash ? hash : user?.payload.password!, newToken) : null

        return res.status(200).send({
            error: false, message: 'Os dados do usuário foram atualizados', user: updatedUser
        })
    }
}

export { UserController }