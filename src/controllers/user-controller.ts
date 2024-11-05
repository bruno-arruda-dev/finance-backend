import { FastifyReply, FastifyRequest } from "fastify";
import { onCreateUserTriggers } from "../utils/on-create-user-triggers";
import { generatePasswordHash } from "../utils/password-hash-generate";
import { jwtGenerate } from "../utils/jwt-generate";
import bcrypt from 'bcrypt'
import { getToken } from "../utils/get-token";
import { ICreateUser, IPutUserUpdate, IUserLogin } from "../routes/user-routes";
import { UserService } from "../services/user-service";

class UserController {
    static async get(req: FastifyRequest, res: FastifyReply) {
        const tempUser = getToken(req.headers.authorization);
        if (!tempUser) return res.status(400).send({ error: true, message: 'Usuário não encontrado' });
        const user = await UserService.get(undefined, tempUser.payload.id);
        if (!user) return res.status(400).send({ error: true, message: 'Usuário não encontrado' });

        return res.status(200).send({ error: false, message: 'Usuário encontrado', user });
    }

    static async post(req: FastifyRequest<ICreateUser>, res: FastifyReply) {
        const { name, email, password } = req.body;

        const emaillreadyRegistered = await UserService.get(email);
        if (emaillreadyRegistered) return res.status(409).send({ error: true, message: `Usuário ${email} já está cadastrado` })

        const hash = await generatePasswordHash(password);

        const user = await UserService.post(email, hash, name ? name : null);

        const userData = { id: user.id, name: user.name, email: user.email, token: user.token }

        await onCreateUserTriggers(user.id);

        return res.status(201).send({ error: false, message: `Usuário cadastrado`, user: userData });
    }

    static async userLogin(req: FastifyRequest<IUserLogin>, res: FastifyReply) {
        const { email, password } = req.body;

        const user = await UserService.get(email);

        if (!user) return res.status(404).send({ error: true, message: 'Usuário não foi encontrado' });

        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) res.status(401).send({ error: true, message: 'Senha incorreta' });

        console.log('controller: ' + user.name)
        const updatedToken = jwtGenerate({ id: user?.id, name: user?.name, email: user?.email, password: user?.password });

        const updatedUser = await UserService.put(user.id, user.name ? user.name : undefined, undefined, undefined, updatedToken);

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

    static async put(req: FastifyRequest<IPutUserUpdate>, res: FastifyReply) {
        const { name, email, password, newPassword } = req.body;

        const user = getToken(req.headers.authorization);
        const databaseUser = await UserService.get(undefined, user?.payload.id)
        const passwordMatch = password && user?.payload.password && databaseUser ? await bcrypt.compare(password, databaseUser.password) : null
        if (newPassword && !passwordMatch) return res.status(401).send({ error: true, message: 'Senha incorreta' });

        if (!databaseUser) return res.status(400).send({ error: true, message: 'Usuário não encontrado' })

        const hash = newPassword ? await generatePasswordHash(newPassword) : null;
        const newToken = jwtGenerate({ id: databaseUser.id, name: name ? name : null, email: email ? email : user?.payload.email!, password: hash ? hash : user?.payload.password! })

        const updatedUser = user?.payload.id ? await UserService.put(user?.payload.id, name ? name : undefined, email ? email : undefined, hash ? hash : user?.payload.password!, newToken) : null

        return res.status(200).send({
            error: false, message: 'Os dados do usuário foram atualizados', user: updatedUser
        })
    }
}

export { UserController }